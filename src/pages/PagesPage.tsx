import { useState } from 'react';
import type { Page } from '../shared/types/entities';
import { useStore } from '../shared/store/useStore';
import { UniversalTable } from '../shared/ui/UniversalTable';
import { EditModal } from '../features/edit-modal/EditModal';
import { formatDate } from '../shared/utils/formatDate';
import { FilterControl } from '../shared/ui/FilterControl';
import { useTableData } from '../shared/hooks/useTableData';

export function PagesPage() {
  const [editing, setEditing] = useState<Page | null>(null);
  const { pages, setPages } = useStore();

  const { sortedData, sort, filters, handleSort, updateFilter } = useTableData({
    initialData: pages,
    dateColumns: ['updatedAt', 'publishedAt'],
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pages</h2>

      <FilterControl filters={filters} updateFilter={updateFilter} hasDateFilter={true} />

      <UniversalTable<Page>
        data={sortedData}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'title', header: 'Title' },
          { key: 'active', header: 'Active' },
          {
            key: 'updatedAt',
            header: 'UpdatedAt',
            render: (row) => formatDate(row.updatedAt),
          },
          {
            key: 'publishedAt',
            header: 'PublishedAt',
            render: (row) => formatDate(row.publishedAt),
          },
        ]}
        onEdit={(row) => setEditing(row)}
        onSort={handleSort}
        sortKey={sort.key}
        sortOrder={sort.order}
      />

      {editing && (
        <EditModal<Page>
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setPages(pages.map((p) => (p.id === updated.id ? updated : p)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
