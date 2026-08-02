import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import type { RewardHistory } from '@/lib/types';

const FULFILMENT_TONE: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  SUCCESS: 'success',
  PENDING: 'warning',
  FAILED: 'danger',
  // Terminal, awaiting a bulk/manual fulfilment pass — never live-dispatched
  // (distinct from the transient in-flight PENDING above).
  PENDING_MANUAL: 'warning'
};

export function RewardsTable({ rewards }: { rewards: RewardHistory[] }) {
  return (
    <Table>
      <Thead>
        <Th>MSISDN</Th>
        <Th>Bouquet</Th>
        <Th>Service</Th>
        <Th>Amount</Th>
        <Th>Fulfilment</Th>
        <Th>Counted toward drop</Th>
        <Th>Granted</Th>
      </Thead>
      <Tbody>
        {rewards.map(reward => (
          <Tr key={reward.id}>
            <Td className="font-mono text-xs">{reward.msisdn}</Td>
            <Td>{reward.ext_bouquet_id}</Td>
            <Td className="font-mono text-xs text-slate-400">{reward.service_key ?? '—'}</Td>
            <Td>GHS {Number(reward.amount).toFixed(2)}</Td>
            <Td>
              <Badge tone={FULFILMENT_TONE[reward.fulfilment_status] ?? 'neutral'}>
                {reward.fulfilment_status}
              </Badge>
            </Td>
            <Td>
              <Badge tone={Number(reward.active) ? 'success' : 'neutral'}>
                {Number(reward.active) ? 'Yes' : 'No — drop ended'}
              </Badge>
            </Td>
            <Td className="text-xs text-slate-400">{new Date(reward.created_at).toLocaleString()}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
