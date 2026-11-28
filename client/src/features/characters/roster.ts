import type { Character } from '@takoyaki/shared';

// 角色列表的搜尋與翻頁規則。

/** 筆記本單頁（左頁或右頁）的拍立得格數：3 欄 × 2 列。 */
export const SLOTS_PER_PAGE = 6;

/** 一次翻開的左右兩頁共幾格；「新增」也佔一格，排在最後。 */
export const SLOTS_PER_SPREAD = SLOTS_PER_PAGE * 2;

/** 名字、職業或標籤包含關鍵字（不分大小寫）。 */
export function matchesSearch(character: Character, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [character.name, character.occupation, ...character.tags].some((text) =>
    text.toLowerCase().includes(q),
  );
}

/** 總頁數（以左右兩頁為一頁計算，新增格也佔一格）。 */
export function pageCount(characterCount: number): number {
  return Math.max(1, Math.ceil((characterCount + 1) / SLOTS_PER_SPREAD));
}
