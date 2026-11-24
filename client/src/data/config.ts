export function resolveDataSource(value: string | undefined): 'mock' | 'api' {
  if (value === undefined) return 'api';
  if (value === 'mock' || value === 'api') return value;

  throw new Error(
    `VITE_DATA_SOURCE 必須是 mock 或 api，目前是 ${JSON.stringify(value)}。`,
  );
}
