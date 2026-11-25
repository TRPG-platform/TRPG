import type { RouteObject } from 'react-router';
import SignedInHomePage from './SignedInHomePage';

// 登入後首頁（#19，TV-2）。路由由 client/src/App.tsx 自動收集。
// TODO(#10, #16)：有登入狀態後，未登入改顯示 #16 的 HomePage（TV-1）。
export default [{ path: '/', element: <SignedInHomePage /> }] satisfies RouteObject[];
