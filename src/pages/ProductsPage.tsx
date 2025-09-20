import { useState } from 'react';
import { useStore, type Product } from '../store/useStore';
import { UniversalTable } from '../components/UniversalTable';
import { EditModal } from '../components/EditModal';
import { formatDate } from '../utils//formatDate';

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
