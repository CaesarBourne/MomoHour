'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { QueryState } from '@/components/ui/QueryState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ServiceTable } from '@/components/services/ServiceTable';
import { ServiceForm } from '@/components/services/ServiceForm';
import { useServices } from '@/lib/queries';
import type { ServiceMap } from '@/lib/types';

export default function ServicesPage() {
  const { data, isLoading, isError, error } = useServices();
  const [editing, setEditing] = useState<ServiceMap | 'new' | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      s => s.service_key.toLowerCase().includes(q) || s.ext_bouquet_id.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div>
      <PageHeader
        title="Services"
        description="The serviceKey → bouquet whitelist. A payment only earns a reward when its service is ACTIVE here and its bouquet has a live drop."
        action={<Button onClick={() => setEditing('new')}>Whitelist a service</Button>}
      />

      <Card className="mb-4 p-3">
        <Input
          placeholder="Search by service key or bouquet…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </Card>

      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {filtered.length === 0 ? (
          <EmptyState
            title={search ? 'No matching services' : 'No services whitelisted yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Whitelist a service so its payments can earn a MoMo Hour reward.'
            }
            action={!search && <Button onClick={() => setEditing('new')}>Whitelist a service</Button>}
          />
        ) : (
          <Card>
            <ServiceTable services={filtered} onEdit={setEditing} />
          </Card>
        )}
      </QueryState>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Whitelist a service' : `Edit ${editing ? editing.service_key : ''}`}
      >
        {editing !== null && (
          <ServiceForm service={editing === 'new' ? undefined : editing} onSuccess={() => setEditing(null)} />
        )}
      </Modal>
    </div>
  );
}
