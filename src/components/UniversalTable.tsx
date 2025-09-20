import React, { useState } from 'react';

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type UniversalTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  dateColumns?: (keyof T)[];
};

export function UniversalTable<T extends { id: number | string }>({
  data,
  columns,
  onEdit,
  dateColumns = [],
}: UniversalTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'true' | 'false'>('all');
  const [selectedDate, setSelectedDate] = useState('');

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredData = data.filter((row) => {
    let matches = true;

    if (filter) {
      const text = filter.toLowerCase();
      matches = Object.values(row).some((val) => String(val).toLowerCase().includes(text));
    }

    if (activeFilter !== 'all' && 'active' in row) {
      const isActive = Boolean(row['active']);
      if ((activeFilter === 'true' && !isActive) || (activeFilter === 'false' && isActive)) {
        matches = false;
      }
    }

    if (selectedDate && dateColumns.length > 0) {
      const selected = new Date(selectedDate).toDateString();
      const dateMatches = dateColumns.some((col) => {
        const value = row[col];
        if (!value) return false;
        const rowDate = new Date(String(value)).toDateString();
        return rowDate === selected;
      });
      if (!dateMatches) matches = false;
    }

    return matches;
  });

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  return (
    <div className="overflow-x-auto border rounded-lg shadow">
      <div className="flex gap-2 p-2 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border px-2 py-1 rounded w-1/3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <select
          className="border px-2 py-1 rounded"
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as 'all' | 'true' | 'false')}>
          <option value="all">Active</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>

        {dateColumns.length > 0 && (
          <div className="flex gap-1 items-center">
            <label className="text-sm">Date:</label>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left px-4 py-2 border-b font-medium text-gray-700 cursor-pointer"
                onClick={() => handleSort(col.key)}>
                {col.header}
                {sortKey === col.key && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
            ))}
            {onEdit && <th className="px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-2 border-b">
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
              {onEdit && (
                <td className="px-4 py-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
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
