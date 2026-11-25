import type { Character } from '@takoyaki/shared';

// 角色列表的搜尋與翻頁規則。

/** 左頁一頁的拍立得格數（4 欄 × 3 列，最後一格是「新增」）。 */
export const SLOTS_PER_PAGE = 12;

/** 名字、職業或標籤包含關鍵字（不分大小寫）。 */
export function matchesSearch(character: Character, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [character.name, character.occupation, ...character.tags].some((text) =>
    text.toLowerCase().includes(q),
  );
}

/** 總頁數（新增格也佔一格）。 */
export function pageCount(characterCount: number): number {
  return Math.max(1, Math.ceil((characterCount + 1) / SLOTS_PER_PAGE));
}
