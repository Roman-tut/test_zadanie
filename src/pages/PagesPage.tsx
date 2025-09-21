import { useState } from 'react';
import type { Page } from '../shared/types/entities';
import { useStore } from '../shared/store/useStore';
import { UniversalTable } from '../shared/ui/UniversalTable';
import { EditModal } from '../features/edit-modal/EditModal';
import { formatDate } from '../shared/utils/formatDate';

export function PagesPage() {
  const [editing, setEditing] = useState<Page | null>(null);
  const { pages, setPages } = useStore();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pages</h2>

      <UniversalTable
        data={pages}
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
        dateColumns={['updatedAt', 'publishedAt']}
        onEdit={(row) => setEditing(row)}
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
