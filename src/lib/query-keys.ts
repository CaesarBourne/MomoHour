// Centralized so mutations invalidate exactly the queries a screen depends on.
export const queryKeys = {
  bouquets: (baseUrl: string) => ['bouquets', baseUrl] as const,
  bouquetsWithServices: (baseUrl: string) => ['bouquets-with-services', baseUrl] as const,
  services: (baseUrl: string) => ['services', baseUrl] as const,
  schedules: (baseUrl: string) => ['schedules', baseUrl] as const,
  currentActiveDrop: (baseUrl: string) => ['current-active-drop', baseUrl] as const,
  active: (baseUrl: string, extBouquetId: string) =>
    ['active', baseUrl, extBouquetId] as const,
  rewards: (baseUrl: string, msisdn?: string) => ['rewards', baseUrl, msisdn ?? null] as const
};
