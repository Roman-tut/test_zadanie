import { useState, useCallback, useMemo } from 'react';
import { parse, isSameDay } from 'date-fns';

type SortState<T> = {
  key: keyof T | null;
  order: 'asc' | 'desc';
};

type FilterState = {
  text: string;
  active: 'all' | 'true' | 'false';
  date: string;
};

type UseTableDataConfig<T> = {
  initialData: T[];
  dateColumns?: (keyof T)[];
  getSearchValues?: (row: T) => string[];
};

export function useTableData<T extends { id: number | string }>({
  initialData,
  dateColumns = [],
  getSearchValues,
}: UseTableDataConfig<T>) {
  const [sort, setSort] = useState<SortState<T>>({ key: null, order: 'asc' });
  const [filters, setFilters] = useState<FilterState>({
    text: '',
    active: 'all',
    date: '',
  });

  const handleSort = useCallback((key: keyof T) => {
    setSort((prev) => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filterData = useMemo(() => {
    return initialData.filter((row) => {
      let matches = true;

      if (filters.text) {
        const text = filters.text.trim().toLowerCase();
        if (text !== '') {
          if (getSearchValues) {
            matches = getSearchValues(row).some((val) => String(val).toLowerCase().includes(text));
          } else {
            matches = Object.entries(row).some(([key, val]) => {
              return (
                String(key).toLowerCase().includes(text) || String(val).toLowerCase().includes(text)
              );
            });
          }
        }
      }

      if (matches && filters.active !== 'all' && 'active' in row) {
        const isActive = Boolean(row['active']);
        if ((filters.active === 'true' && !isActive) || (filters.active === 'false' && isActive)) {
          matches = false;
        }
      }

      if (matches && filters.date && dateColumns.length > 0) {
        const parseSelected = parse(filters.date, 'dd.MM.yyyy', new Date());
        const dateMatches = dateColumns.some((col) => {
          const value = row[col];
          if (!value) return false;
          const rowDate = new Date(String(value));
          return isSameDay(parseSelected, rowDate);
        });
        if (!dateMatches) matches = false;
      }

      return matches;
    });
  }, [initialData, filters, dateColumns, getSearchValues]);
  const sortedData = useMemo(() => {
    if (!sort.key) return filterData;
    return [...filterData].sort((a, b) => {
      const aVal = a[sort.key!];
      const bVal = b[sort.key!];

      if (aVal == null && bVal !== null) return sort.order === 'asc' ? -1 : 1;
      if (bVal == null && aVal !== null) return sort.order === 'asc' ? 1 : -1;
      if (aVal == null && bVal == null) return 0;

      if (aVal < bVal) return sort.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filterData, sort]);

  return {
    sortedData,
    sort,
    filters,
    handleSort,
    updateFilter,
  };
}
