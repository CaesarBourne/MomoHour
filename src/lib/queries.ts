'use client';

import { useQuery } from '@tanstack/react-query';
import { useBaseUrl } from './base-url';
import { queryKeys } from './query-keys';
import * as api from './api';
import type { ListRewardsInput } from './types';

/**
 * Every hook here throws when the underlying call fails at the network/HTTP
 * level, so TanStack Query's own `isError`/`error` states handle that case —
 * list endpoints never return an in-body business rejection, only mutations
 * do (those are handled separately per-form via useMutation + ApiResult).
 */
function unwrapOrThrow<T>(result: Awaited<ReturnType<() => Promise<api.ApiResult<T>>>>): T {
  if (!result.ok) {
    throw new Error(result.message);
  }
  return result.data;
}

export function useBouquets() {
  const { baseUrl } = useBaseUrl();
  return useQuery({
    queryKey: queryKeys.bouquets(baseUrl),
    queryFn: async () => unwrapOrThrow(await api.listBouquets(baseUrl))
  });
}

export function useBouquetsWithServices() {
  const { baseUrl } = useBaseUrl();
  return useQuery({
    queryKey: queryKeys.bouquetsWithServices(baseUrl),
    queryFn: async () => unwrapOrThrow(await api.listBouquetsWithServices(baseUrl))
  });
}

export function useServices() {
  const { baseUrl } = useBaseUrl();
  return useQuery({
    queryKey: queryKeys.services(baseUrl),
    queryFn: async () => unwrapOrThrow(await api.listServices(baseUrl))
  });
}

export function useSchedules() {
  const { baseUrl } = useBaseUrl();
  return useQuery({
    queryKey: queryKeys.schedules(baseUrl),
    queryFn: async () => unwrapOrThrow(await api.listSchedules(baseUrl))
  });
}

export function useCurrentActiveDrop() {
  const { baseUrl } = useBaseUrl();
  return useQuery({
    queryKey: queryKeys.currentActiveDrop(baseUrl),
    queryFn: async () => unwrapOrThrow(await api.getCurrentActiveDrop(baseUrl)),
    refetchInterval: 30_000
  });
}

export function useDrops(extBouquetId?: string) {
  const { baseUrl } = useBaseUrl();
  return useQuery({
    queryKey: queryKeys.drops(baseUrl, extBouquetId),
    queryFn: async () => unwrapOrThrow(await api.listDrops(baseUrl, extBouquetId))
  });
}

export function useRewards(filters: ListRewardsInput = {}) {
  const { baseUrl } = useBaseUrl();
  return useQuery({
    queryKey: queryKeys.rewards(baseUrl, filters),
    queryFn: async () => unwrapOrThrow(await api.listRewards(baseUrl, filters))
  });
}
