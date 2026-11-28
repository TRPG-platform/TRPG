import { createBlankRuleData, type Character } from '@takoyaki/shared';
import { dataSource } from './index';
import { mockCharacters } from './mockCharacters';

// 角色卡的資料存取（character-card）。API 路徑依 character-card design.md。
// mock 模式下資料存在記憶體，重新整理頁面就會回到初始假資料。

let mockStore: Character[] = structuredClone(mockCharacters);

const now = () => new Date().toISOString();

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok)
    throw new Error(`${init.method ?? 'GET'} ${path} 失敗（HTTP ${response.status}）。`);
  return (await response.json()) as T;
}

/** 目前使用者的角色，最後編輯的排在前面。 */
export async function listMyCharacters(signal?: AbortSignal): Promise<Character[]> {
  if (dataSource === 'mock') {
    return structuredClone(mockStore).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return request('/api/characters', { signal });
}

/** 建立名為「未命名調查員」的新角色。 */
export async function createCharacter(): Promise<Character> {
  if (dataSource === 'mock') {
    const created: Character = {
      id: `char-${crypto.randomUUID()}`,
      ownerId: mockStore[0]?.ownerId ?? 'sample-player',
      name: '未命名調查員',
      occupation: '',
      portraitUrl: null,
      ruleSystem: 'CoC 7e',
      ruleData: createBlankRuleData() as unknown as Record<string, unknown>,
      tags: [],
      updatedAt: now(),
    };
    mockStore = [...mockStore, created];
    return structuredClone(created);
  }
  return request('/api/characters', {
    method: 'POST',
    body: JSON.stringify({ name: '未命名調查員' }),
  });
}

export type CharacterChanges = Pick<
  Character,
  'name' | 'occupation' | 'portraitUrl' | 'tags' | 'ruleData'
>;

/** 存檔。正式版只送原始輸入，伺服器回傳含衍生數值的完整角色卡。 */
export async function saveCharacter(id: string, changes: CharacterChanges): Promise<Character> {
  if (dataSource === 'mock') {
    const current = mockStore.find((item) => item.id === id);
    if (!current) throw new Error('找不到這個角色。');
    const saved: Character = { ...current, ...structuredClone(changes), updatedAt: now() };
    mockStore = mockStore.map((item) => (item.id === id ? saved : item));
    return structuredClone(saved);
  }
  return request(`/api/characters/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}

export async function deleteCharacter(id: string): Promise<void> {
  if (dataSource === 'mock') {
    mockStore = mockStore.filter((item) => item.id !== id);
    return;
  }
  const response = await fetch(`/api/characters/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (response.status === 409) throw new Error('這個角色正在房間中使用，無法刪除');
  if (!response.ok) throw new Error(`刪除失敗（HTTP ${response.status}）。`);
}
