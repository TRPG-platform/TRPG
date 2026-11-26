import { useSyncExternalStore } from 'react';

// 假的登入狀態（app-shell「Login redirect for protected pages」，票 #10）。
// account-auth 完成後改成 GET /api/auth/me，對外的函式名稱維持不變。
//
// 切換方式（會記在 localStorage，重新整理後仍有效）：
//   網址加 ?auth=out → 變成未登入；加 ?auth=in → 變成已登入
// 預設是已登入，免得大家開發各自頁面時一直被導去登入頁。

const STORAGE_KEY = 'takoyaki.fakeSignedIn';
const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

function applyUrlSwitch(): void {
  const value = new URLSearchParams(window.location.search).get('auth');
  if (value === 'in' || value === 'out') {
    try {
      localStorage.setItem(STORAGE_KEY, String(value === 'in'));
    } catch {
      // localStorage 不能用時只在這次分頁內生效
    }
    signedIn = value === 'in';
  }
}

let signedIn = readStored();
applyUrlSwitch();

function setSignedIn(value: boolean): void {
  signedIn = value;
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // 同上
  }
  listeners.forEach((listener) => listener());
}

/** 登入成功後呼叫（#17 登入頁接上）。 */
export function signIn(): void {
  setSignedIn(true);
}

/** 登出（導覽列頭像選單）。 */
export function signOut(): void {
  setSignedIn(false);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** 目前是否已登入；狀態改變時元件會重新渲染。 */
export function useSignedIn(): boolean {
  return useSyncExternalStore(subscribe, () => signedIn);
}

/** 登入頁網址；`from` 是登入後要回去的頁面。 */
export function loginPath(from?: string): string {
  return from ? `/login?redirect=${encodeURIComponent(from)}` : '/login';
}

/**
 * 登入成功後要去的頁面：讀登入頁網址的 ?redirect=，沒有或不合法時回首頁。
 * 只接受站內路徑，避免被拿來導到外部網站。
 */
export function redirectAfterLogin(search: string): string {
  const target = new URLSearchParams(search).get('redirect');
  return target && target.startsWith('/') && !target.startsWith('//') ? target : '/';
}
