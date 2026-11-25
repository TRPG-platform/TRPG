const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/** 預計時長，例如「約 4–6 小時」；劇本沒填時回傳 null（不顯示）。 */
export function formatDuration(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null;
  if (min === null || max === null || min === max) return `約 ${min ?? max} 小時`;
  return `約 ${min}–${max} 小時`;
}

/** 開團時間，例如「11 / 21（六）20:00」，使用瀏覽器的時區。 */
export function formatSchedule(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getMonth() + 1} / ${date.getDate()}（${WEEKDAYS[date.getDay()]}）${hours}:${minutes}`;
}

/** 公告編輯時間，例如「11 / 12 18:32」，使用瀏覽器的時區。 */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getMonth() + 1} / ${date.getDate()} ${hours}:${minutes}`;
}
