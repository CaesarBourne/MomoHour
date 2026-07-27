'use client';

import { useState, type FormEvent } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { QueryState } from '@/components/ui/QueryState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RewardsTable } from '@/components/rewards/RewardsTable';
import { useRewards } from '@/lib/queries';

export default function RewardsPage() {
  const [msisdnInput, setMsisdnInput] = useState('');
  const [msisdn, setMsisdn] = useState<string | undefined>(undefined);
  const { data, isLoading, isError, error } = useRewards(msisdn);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setMsisdn(msisdnInput.trim() || undefined);
  };

  const clearSearch = () => {
    setMsisdnInput('');
    setMsisdn(undefined);
  };

  return (
    <div>
      <PageHeader
        title="Rewards"
        description={
          msisdn
            ? `Reward history for ${msisdn}.`
            : 'Latest 200 rewards granted across all customers and drops.'
        }
      />

      <Card className="mb-4 p-3">
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Input
              placeholder="Search by MSISDN, e.g. 233559428678"
              value={msisdnInput}
              onChange={e => setMsisdnInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
          {msisdn && (
            <Button type="button" variant="ghost" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </form>
      </Card>

      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {data && data.length === 0 ? (
          <EmptyState
            title={msisdn ? 'No rewards for this MSISDN' : 'No rewards granted yet'}
            description={
              msisdn
                ? 'Nothing found for that number — check it and try again.'
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
