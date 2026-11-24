import type { HealthResponse } from '@takoyaki/shared';
import { resolveDataSource } from './config';
import { sampleCharacter, sampleRoom, sampleScript } from './mock';

export const dataSource = resolveDataSource(import.meta.env.VITE_DATA_SOURCE);

export async function readData<T>(
  path: `/api/${string}`,
  getMockData: () => T,
  signal?: AbortSignal,
): Promise<T> {
  if (dataSource === 'mock') return getMockData();

  const response = await fetch(path, { signal });
  if (!response.ok) {
    throw new Error(`讀取 ${path} 失敗（HTTP ${response.status}）。`);
  }
  return (await response.json()) as T;
}

export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return readData('/api/health', () => ({ ok: true }), signal);
}

// The starter page displays these fixtures only in mock mode.
export function getMockPreview() {
  return dataSource === 'mock'
    ? structuredClone({ script: sampleScript, character: sampleCharacter, room: sampleRoom })
    : null;
}
