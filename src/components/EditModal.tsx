import { useState } from 'react';

type Option = { size: string; amount: number };

export type Item = {
  id: number;
  name: string;
  title?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  options?: Option | Option[];
};

type EditModalProps = {
  item: Item | null;
  onClose: () => void;
  onSave: (updated: Item) => void;
};

export function EditModal({ item, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<Item | null>(item);

  if (!formData) return null;

  const handleChange = <K extends keyof Omit<Item, 'options'>>(field: K, value: Item[K]) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const renderInput = (field: keyof Item) => {
    const value = formData[field];
    const isIdField = field === 'id';
    const isInactiveField =
      !formData.active && ['name', 'title', 'description'].includes(field.toString().toLowerCase());
    const disabled = isIdField || isInactiveField;

    // boolean
    if (typeof value === 'boolean') {
      return (
        <label key={field} className="flex items-center gap-2 mb-2">
          {field}:
          <input
            type="checkbox"
            checked={value}
            disabled={disabled}
            className={disabled ? 'bg-gray-200 cursor-not-allowed' : ''}
            onChange={(e) => handleChange(field as keyof Omit<Item, 'options'>, e.target.checked)}
          />
        </label>
      );
    }

    // number
    if (typeof value === 'number') {
      return (
        <label key={field} className="block mb-2">
          {field}:
          <input
            type="number"
            value={value}
            disabled={disabled}
            className={`border rounded px-2 py-1 w-full ${
              disabled ? 'bg-gray-200 cursor-not-allowed' : ''
            }`}
            onChange={(e) =>
              handleChange(field as keyof Omit<Item, 'options'>, Number(e.target.value))
            }
          />
        </label>
      );
    }

    // date
    if (typeof value === 'string' && field.toString().toLowerCase().includes('date')) {
      return (
        <label key={field} className="block mb-2">
          {field}:
          <input
            type="date"
            value={value.split('T')[0]}
            disabled={disabled}
            className={`border rounded px-2 py-1 w-full ${
              disabled ? 'bg-gray-200 cursor-not-allowed' : ''
            }`}
            onChange={(e) => handleChange(field as keyof Omit<Item, 'options'>, e.target.value)}
          />
        </label>
      );
    }

    // options
    if (field === 'options' && value) {
      const options: Option[] = Array.isArray(value)
        ? (value as Option[])
        : [{ ...(value as Option) }];

      return (
        <div key={field} className="mb-2 pl-2 border-l border-gray-200">
          <div className="font-semibold">Options:</div>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2 mb-1">
              <input
                type="text"
                placeholder="Size"
                value={option.size}
                className="border rounded px-2 py-1 w-1/2"
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = { ...newOptions[index], size: e.target.value };
                  setFormData({
                    ...formData,
                    options: Array.isArray(value) ? newOptions : newOptions[0],
                  });
                }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={option.amount}
                className="border rounded px-2 py-1 w-1/2"
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = { ...newOptions[index], amount: Number(e.target.value) };
                  setFormData({
                    ...formData,
                    options: Array.isArray(value) ? newOptions : newOptions[0],
                  });
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    // string
    if (typeof value === 'string') {
      return (
        <label key={field} className="block mb-2">
          {field}:
          <input
            type="text"
            value={value}
            disabled={disabled}
            className={`border rounded px-2 py-1 w-full ${
              disabled ? 'bg-gray-200 cursor-not-allowed' : ''
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
      <div className="bg-white p-6 rounded-lg shadow w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Edit Item</h3>

        {Object.keys(formData).map((key) => renderInput(key as keyof Item))}

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => formData && onSave(formData)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
