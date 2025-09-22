import React from 'react';

type FilterControlProps = {
  filters: {
    text: string;
    active: 'all' | 'true' | 'false';
    date: string;
  };
  updateFilter: (key: 'text' | 'active' | 'date', value: string) => void;
  hasDateFilter: boolean;
};

export const FilterControl: React.FC<FilterControlProps> = ({
  filters,
  updateFilter,
  hasDateFilter,
}) => {
  return (
    <div className="flex gap-2 p-3 flex-wrap items-center bg-gray-50 border-b rounded-t-lg">
      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-2 rounded w-1/3 focus:ring-blue-300 focus:outline-none"
        value={filters.text}
        onChange={(e) => updateFilter('text', e.target.value)}
      />
      <select
        className="border px-3 py-2 rounded focus:ring-2 focus:ring focus:ring-blue-300 focus:outline-none"
        value={filters.active}
        onChange={(e) => updateFilter('active', e.target.value)}>
        <option value="all">Active</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>

      {hasDateFilter && (
        <div className="flex gap-1 items-center">
          <label className="text-sm">Date:</label>
          <input
            type="text"
            placeholder="22.09.2025"
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
            value={filters.date}
            onChange={(e) => updateFilter('date', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
