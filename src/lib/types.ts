// Mirrors the GHA TypeORM entities in GHA/src/momo-hour/entities/*.

export interface Bouquet {
  id: number;
  ext_bouquet_id: string;
  name: string;
  category: string;
  reward_type: string;
  reward_value: string | null;
  match_ratio: string | number;
  cap_amount: string | number;
  start_date: string | null;
  end_date: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface ServiceMap {
  id: number;
  service_key: string;
  ext_bouquet_id: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface BouquetWithServices extends Bouquet {
  services: ServiceMap[];
}

export interface Schedule {
  id: string;
  ext_bouquet_id: string;
  campaign_date: string;
  start_hour: string;
  end_hour: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

export interface ActiveDrop {
  id: number;
  drop_id: string;
  ext_bouquet_id: string;
  start_at: string;
  end_at: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LiveDropData {
  dropId: string;
  extBouquetId: string;
  name: string;
  category: string;
  status: string;
  rewardType: string;
  rewardValue: string | number | null;
  matchRatio: number;
  capAmount: number;
  startAt: string;
  endAt: string;
}

export interface GetActiveResponse {
  live: boolean;
  data: LiveDropData | Bouquet | null;
}

export interface RewardHistory {
  id: string;
  drop_id: string;
  ext_bouquet_id: string;
  msisdn: string;
  sending_fri: string | null;
  receiving_fri: string | null;
  source_transaction_id: string | null;
  reward_transaction_id: string | null;
  reward_type: string;
  reward_value: string | null;
  amount: string | number;
  status: string;
  fulfilment_status: 'PENDING' | 'SUCCESS' | 'FAILED' | string;
  /** Still counted toward its drop — flips false when the drop ends. */
  active: boolean | number;
  created_at: string;
}

export interface UpsertBouquetInput {
  extBouquetId: string;
  name: string;
  category: string;
  rewardType?: string;
  rewardValue?: string;
  matchRatio?: number;
  capAmount?: number;
  startDate?: string;
  endDate?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpsertServiceInput {
  serviceKey: string;
  extBouquetId: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateScheduleInput {
  extBouquetId: string;
  campaignDate: string;
  /** Every slot is a fixed 60 minutes — endHour is computed server-side. */
  startHour: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateScheduleResult {
  created: boolean;
  reason?: string;
  schedule?: Schedule;
}

export interface UpdateScheduleStatusInput {
  id: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateScheduleStatusResult {
  updated: boolean;
  reason?: string;
  schedule?: Schedule;
}

export interface ActivateDropInput {
  extBouquetId: string;
}

export interface ActivateDropResult {
  activated: boolean;
  reason?: string;
  activeDrop?: ActiveDrop;
  drop?: LiveDropData;
}

export interface EndDropInput {
  extBouquetId?: string;
  dropId?: string;
}

export interface EndDropResult {
  ended: boolean;
  reason?: string;
  activeDrop?: ActiveDrop;
}

export interface TriggerRewardInput {
  extBouquetId?: string;
  serviceKey?: string;
  msisdn: string;
  amount: number | string;
  transactionId?: string;
  sendingFri?: string;
  receivingFri?: string;
}

export interface TriggerRewardResult {
  triggered: boolean;
  reason?: string;
  data?: unknown;
}
