import { useState } from 'react';
import { useStore } from '../shared/store/useStore';
import type { Product } from '../shared/types/entities';
import { UniversalTable } from '../shared/ui/UniversalTable';
import { EditModal } from '../features/edit-modal/EditModal';
import { formatDate } from '../shared/utils/formatDate';

export function ProductsPage() {
  const { products, setProducts } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <UniversalTable
        data={products}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          {
            key: 'options',
            header: 'Options',
            render: (row) => `${row.options.size} /${row.options.amount}`,
          },
          { key: 'active', header: 'Active' },
          { key: 'createdAt', header: 'Created At', render: (row) => formatDate(row.createdAt) },
        ]}
        dateColumns={['createdAt']}
        onEdit={(row) => setEditing(row)}
      />
      {editing && (
        <EditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
