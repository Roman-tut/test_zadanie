import React from 'react';
type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type UniversalTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onSort?: (key: keyof T) => void;
  sortKey?: keyof T | null;
  sortOrder: 'asc' | 'desc';
};

function UniversalTableComponent<T extends { id: number | string }>({
  data,
  columns,
  onEdit,
  onSort,
  sortKey,
  sortOrder,
}: UniversalTableProps<T>) {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-lg bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-blue-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left px-4 py-3 border-b font-semibold text-blue-700 cursor-pointer select-none transition-colors hover:bg-blue-100"
                onClick={() => onSort && onSort(col.key)}>
                {col.header}
                {sortKey === col.key && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
            ))}
            {onEdit && <th className="px-4 py-3 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id}
              className={`transition-colors ${
                idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-blue-50`}>
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-2 border-b text-gray-700">
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
              {onEdit && (
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => onEdit(row)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export const UniversalTable = React.memo(UniversalTableComponent) as typeof UniversalTableComponent;
