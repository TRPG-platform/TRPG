import type { RouteObject } from 'react-router';
import ForgotPasswordPage from './ForgotPasswordPage';

// 忘記密碼頁（#42）。路由由 client/src/App.tsx 自動收集。
export default [
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
] satisfies RouteObject[];
