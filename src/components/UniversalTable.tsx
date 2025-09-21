import React, { useState } from 'react';
import { parse, isSameDay } from 'date-fns';

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
    if (sortKey === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
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
      const parsedSelected = parse(selectedDate, 'dd.MM.yyyy', new Date());
      const dateMatches = dateColumns.some((col) => {
        const value = row[col];
        if (!value) return false;
        const rowDate = new Date(String(value));
        return isSameDay(parsedSelected, rowDate);
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
    <div className="overflow-x-auto border rounded-lg shadow-lg bg-white">
      {/* фильтры */}
      <div className="flex gap-2 p-3 flex-wrap items-center bg-gray-50 border-b rounded-t-lg">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded w-1/3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
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
              type="text"
              placeholder="22.09.1960"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* таблица */}
      <table className="w-full border-collapse">
        <thead className="bg-blue-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left px-4 py-3 border-b font-semibold text-blue-700 cursor-pointer select-none transition-colors hover:bg-blue-100"
                onClick={() => handleSort(col.key)}>
                {col.header}
                {sortKey === col.key && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
            ))}
            {onEdit && <th className="px-4 py-3 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
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
