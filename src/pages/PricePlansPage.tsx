import { useStore } from '../shared/store/useStore';
import type { PricePlan } from '../shared/types/entities';
import { useState } from 'react';
import { UniversalTable } from '../shared/ui/UniversalTable';
import { EditModal } from '../features/edit-modal/EditModal';
import { formatDate } from '../shared/utils/formatDate';
import { FilterControl } from '../shared/ui/FilterControl';
import { useTableData } from '../shared/hooks/useTableData';

export function PricePlansPage() {
  const { pricePlans, setPricePlans } = useStore();
  const [editing, setEditing] = useState<PricePlan | null>(null);

  const { sortedData, sort, filters, handleSort, updateFilter } = useTableData({
    initialData: pricePlans,
    dateColumns: ['createdAt', 'removedAt'],
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Price Plan</h2>

      <FilterControl filters={filters} updateFilter={updateFilter} hasDateFilter={true} />

      <UniversalTable<PricePlan>
        data={sortedData}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'description', header: 'Description' },
          { key: 'active', header: 'Active' },

          { key: 'createdAt', header: 'CreatedAt ', render: (row) => formatDate(row.createdAt) },
          { key: 'removedAt', header: 'RemovedAt ', render: (row) => formatDate(row.removedAt) },
        ]}
        onEdit={(row) => setEditing(row)}
        onSort={handleSort}
        sortKey={sort.key}
        sortOrder={sort.order}
      />

      {editing && (
        <EditModal<PricePlan>
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setPricePlans(pricePlans.map((p) => (p.id === updated.id ? updated : p)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
