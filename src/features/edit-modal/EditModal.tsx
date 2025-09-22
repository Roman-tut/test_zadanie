import { useState, useEffect, useCallback, memo } from 'react';

type Option = { size: string; amount: number };

export type Item = {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  options?: Option | Option[];
};

type EditModalProps<T extends Item> = {
  item: T;
  onClose: () => void;
  onSave: (updated: T) => void;
};

function EditModalComponent<T extends Item>({ item, onClose, onSave }: EditModalProps<T>) {
  const [formData, setFormData] = useState<T>(() => item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = <K extends keyof Omit<Item, 'options'>>(field: K, value: Item[K]) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (formData) {
      onSave(formData);
    }
  }, [formData, onSave]);

  const handleOptionsChange = useCallback(
    (index: number, field: keyof Option, value: string | number) => {
      setFormData((prev) => {
        if (!prev || !prev.options) return prev;

        const currentOptions = Array.isArray(prev.options)
          ? [...prev.options]
          : [{ ...prev.options }];

        const newOptions = [...currentOptions];
        newOptions[index] = { ...newOptions[index], [field]: value };

        return {
          ...prev,
          options: Array.isArray(prev.options) ? newOptions : newOptions[0],
        };
      });
    },
    [],
  );

  if (!formData) return null;

  const renderInput = (field: keyof Item) => {
    const value = formData[field];

    const isIdField = field === 'id';
    const isInactiveField =
      !formData.active && ['name', 'title', 'description'].includes(field.toString().toLowerCase());
    const disabled = isIdField || isInactiveField;

    if (typeof value === 'boolean') {
      return (
        <label key={field} className="flex items-center gap-2 mb-3">
          <span className="capitalize">{field}:</span>
          <input
            type="checkbox"
            checked={value}
            disabled={disabled}
            className={`h-5 w-5 rounded border-gray-300 ${disabled ? 'cursor-not-allowed' : ''}`}
            onChange={(e) => handleChange(field as keyof Omit<Item, 'options'>, e.target.checked)}
          />
        </label>
      );
    }

    if (typeof value === 'number') {
      return (
        <label key={field} className="block mb-3">
          <span className="capitalize">{field}:</span>
          <input
            type="number"
            value={value}
            disabled={disabled}
            className={`mt-1 block w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            onChange={(e) =>
              handleChange(field as keyof Omit<Item, 'options'>, Number(e.target.value))
            }
          />
        </label>
      );
    }

    if (typeof value === 'string' && field.toString().toLowerCase().includes('date')) {
      return (
        <label key={field} className="block mb-3">
          <span className="capitalize">{field}:</span>
          <input
            type="date"
            value={value.split('T')[0]}
            disabled={disabled}
            className={`mt-1 block w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            onChange={(e) => handleChange(field as keyof Omit<Item, 'options'>, e.target.value)}
          />
        </label>
      );
    }

    if (field === 'options' && value) {
      const options: Option[] = Array.isArray(value)
        ? (value as Option[])
        : [{ ...(value as Option) }];

      return (
        <div key={field} className="mb-3 p-2 border rounded bg-gray-50">
          <div className="font-semibold mb-2">Options:</div>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Size"
                value={option.size}
                className="border rounded px-3 py-2 w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={(e) => handleOptionsChange(index, 'size', e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={option.amount}
                className="border rounded px-3 py-2 w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={(e) => handleOptionsChange(index, 'amount', Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'string') {
      return (
        <label key={field} className="block mb-3">
          <span className="capitalize">{field}:</span>
          <input
            type="text"
            value={value}
            disabled={disabled}
            className={`mt-1 block w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            onChange={(e) => handleChange(field as keyof Omit<Item, 'options'>, e.target.value)}
          />
        </label>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-y-auto animate-fadeIn">
        <h3 className="text-xl font-bold mb-5 text-center text-blue-700">Edit Item</h3>

        {Object.keys(formData).map((key) => renderInput(key as keyof Item))}

        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            onClick={handleClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export const EditModal = memo(EditModalComponent) as typeof EditModalComponent;
