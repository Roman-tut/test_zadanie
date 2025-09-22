import { useState } from 'react';
import { useStore } from '../shared/store/useStore';
import type { Product } from '../shared/types/entities';
import { UniversalTable } from '../shared/ui/UniversalTable';
import { EditModal } from '../features/edit-modal/EditModal';
import { formatDate } from '../shared/utils/formatDate';
import { FilterControl } from '../shared/ui/FilterControl';
import { useTableData } from '../shared/hooks/useTableData';

export function ProductsPage() {
  const { products, setProducts } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);

  const { sortedData, sort, filters, handleSort, updateFilter } = useTableData({
    initialData: products,
    dateColumns: ['createdAt'],
    getSearchValues: (row) => [
      String(row.id),
      row.name,
      row.options.size,
      String(row.options.amount),
      String(row.active),
      row.createdAt,
    ],
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      <FilterControl filters={filters} updateFilter={updateFilter} hasDateFilter={true} />

      <UniversalTable<Product>
        data={sortedData}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          {
            key: 'options',
            header: 'Options',
            render: (row) => `${row.options.size} / ${row.options.amount}`,
          },
          { key: 'active', header: 'Active' },
          {
            key: 'createdAt',
            header: 'Created At',
            render: (row) => formatDate(row.createdAt),
          },
        ]}
        onEdit={(row) => setEditing(row)}
        onSort={handleSort}
        sortKey={sort.key}
        sortOrder={sort.order}
      />

      {editing && (
        <EditModal<Product>
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
