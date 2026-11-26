import { createBrowserRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import RequireAuth from './auth/RequireAuth';
import StatusPage from './StatusPage';

// 全站路由（app-shell，票 #5）。
//
// 新增頁面不用改這個檔案：在自己的功能資料夾放一個 routes.tsx，預設匯出路由陣列，
// 這裡會自動收集。例如 client/src/features/characters/routes.tsx：
//
//   import type { RouteObject } from 'react-router';
//   import CharactersPage from './CharactersPage';
//
//   export default [{ path: '/characters', element: <CharactersPage /> }] satisfies RouteObject[];
//
// 沒有任何頁面認領的網址，顯示前後端連線狀態頁。

const modules = import.meta.glob<{ default: RouteObject[] }>('./features/*/routes.tsx', {
  eager: true,
});

const featureRoutes = Object.entries(modules).flatMap(([file, module]) => {
  if (!Array.isArray(module.default)) {
    throw new Error(`${file} 必須用 export default 匯出路由陣列。`);
  }
  return module.default;
});

// 兩個功能宣告了同一個網址時，開發中直接在主控台提醒（只會有一個生效）。
if (import.meta.env.DEV) {
  const seen = new Map<string, number>();
  for (const route of featureRoutes) {
    if (route.path) seen.set(route.path, (seen.get(route.path) ?? 0) + 1);
  }
  for (const [path, count] of seen) {
    if (count > 1) console.warn(`路由 ${path} 被宣告了 ${count} 次，請檢查各功能的 routes.tsx。`);
  }
}

// 所有頁面都包在路由守衛裡（票 #10）：首頁與 /login 以外，未登入會被導向登入頁。
const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [...featureRoutes, { path: '*', element: <StatusPage /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
