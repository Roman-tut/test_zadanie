import { useStore } from '../store/useStore';
import type { PricePlan } from '../store/useStore';
import { useState } from 'react';
import { UniversalTable } from '../components/UniversalTable';
import { EditModal } from '../components/EditModal';
import { formatDate } from '../utils//formatDate';

export function PricePlansPage() {
  const { pricePlans, setPricePlans } = useStore();
  const [editing, setEditing] = useState<PricePlan | null>(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Price Plan</h2>

      <UniversalTable<PricePlan>
        data={pricePlans}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'description', header: 'Description' },
          { key: 'active', header: 'Active' },

          { key: 'createdAt', header: 'CreatedAt ', render: (row) => formatDate(row.createdAt) },
          { key: 'removedAt', header: 'RemovedAt ', render: (row) => formatDate(row.removedAt) },
        ]}
        dateColumns={['createdAt', 'removedAt']}
        onEdit={(row) => setEditing(row)}
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
