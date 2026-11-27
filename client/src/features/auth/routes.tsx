import type { RouteObject } from 'react-router';
import LoginPage from './LoginPage';

// 登入頁（#17，TV-4）。路由由 client/src/App.tsx 自動收集。
export default [{ path: '/login', element: <LoginPage /> }] satisfies RouteObject[];
