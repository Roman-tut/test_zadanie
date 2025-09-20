import { useState } from 'react';
import type { Page } from '../store/useStore';
import { useStore } from '../store/useStore';
import { UniversalTable } from '../components/UniversalTable';
import { EditModal } from '../components/EditModal';
import { formatDate } from '../utils//formatDate';

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
