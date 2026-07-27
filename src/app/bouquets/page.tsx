'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { QueryState } from '@/components/ui/QueryState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BouquetCard } from '@/components/bouquets/BouquetCard';
import { BouquetForm } from '@/components/bouquets/BouquetForm';
import { useBouquetsWithServices } from '@/lib/queries';
import type { Bouquet } from '@/lib/types';

export default function BouquetsPage() {
  const { data, isLoading, isError, error } = useBouquetsWithServices();
  const [editing, setEditing] = useState<Bouquet | 'new' | null>(null);

  return (
    <div>
      <PageHeader
        title="Bouquets"
        description="Each bouquet groups a set of eligible services under one reward. Only one bouquet's drop can be live at a time."
        action={<Button onClick={() => setEditing('new')}>New bouquet</Button>}
      />

      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {data && data.length === 0 ? (
          <EmptyState
            title="No bouquets yet"
            description="Create your first bouquet to start whitelisting services under it."
            action={<Button onClick={() => setEditing('new')}>New bouquet</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data?.map(bouquet => (
              <BouquetCard key={bouquet.id} bouquet={bouquet} onEdit={() => setEditing(bouquet)} />
            ))}
          </div>
        )}
      </QueryState>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New bouquet' : `Edit ${editing?.ext_bouquet_id ?? ''}`}
      >
        {editing !== null && (
          <BouquetForm
            bouquet={editing === 'new' ? undefined : editing}
            onSuccess={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
