'use client';

import { useState, type FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { QueryState } from '@/components/ui/QueryState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RefreshButton } from '@/components/ui/RefreshButton';
import { RewardsTable } from '@/components/rewards/RewardsTable';
import { useRewards } from '@/lib/queries';
import type { ListRewardsInput } from '@/lib/types';

const EMPTY_FILTERS: ListRewardsInput = {};

export default function RewardsPage() {
  const [form, setForm] = useState({
    msisdn: '',
    extBouquetId: '',
    serviceKey: '',
    fulfilmentStatus: ''
  });
  const [filters, setFilters] = useState<ListRewardsInput>(EMPTY_FILTERS);
  const { data, isLoading, isError, error, refetch, isFetching } = useRewards(filters);

  const hasFilters = Object.keys(filters).length > 0;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setFilters({
      msisdn: form.msisdn.trim() || undefined,
      extBouquetId: form.extBouquetId.trim() || undefined,
      serviceKey: form.serviceKey.trim() || undefined,
      fulfilmentStatus: form.fulfilmentStatus || undefined
    });
  };

  const clearSearch = () => {
    setForm({ msisdn: '', extBouquetId: '', serviceKey: '', fulfilmentStatus: '' });
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div>
      <PageHeader
        title="Rewards"
        description={
          hasFilters
            ? 'Filtered reward history — e.g. every PENDING_MANUAL row for a bouquet is the bulk-fulfilment export list.'
            : 'Latest 200 rewards granted across all customers and drops.'
        }
        action={<RefreshButton onRefresh={() => refetch()} isRefreshing={isFetching} />}
      />

      <Card className="mb-4 p-3">
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Input
              placeholder="MSISDN, e.g. 233559428678"
              value={form.msisdn}
              onChange={e => setForm(f => ({ ...f, msisdn: e.target.value }))}
            />
          </div>
          <div className="min-w-[140px]">
            <Input
              placeholder="Bouquet, e.g. BQ1"
              value={form.extBouquetId}
              onChange={e => setForm(f => ({ ...f, extBouquetId: e.target.value }))}
            />
          </div>
          <div className="min-w-[180px]">
            <Input
              placeholder="Service key, e.g. databundle-flexi"
              value={form.serviceKey}
              onChange={e => setForm(f => ({ ...f, serviceKey: e.target.value }))}
            />
          </div>
          <div className="min-w-[180px]">
            <Select
              value={form.fulfilmentStatus}
              onChange={e => setForm(f => ({ ...f, fulfilmentStatus: e.target.value }))}
            >
              <option value="">Any fulfilment status</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING_MANUAL">Pending (manual)</option>
            </Select>
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
          {hasFilters && (
            <Button type="button" variant="ghost" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </form>
      </Card>

      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {data && data.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No rewards match these filters' : 'No rewards granted yet'}
            description={
              hasFilters
                ? 'Nothing found for that combination — adjust the filters and try again.'
                : 'Rewards will show up here once a whitelisted payment happens during a live drop.'
            }
          />
        ) : (
          <Card>
            <RewardsTable rewards={data ?? []} />
          </Card>
        )}
      </QueryState>
    </div>
  );
}
