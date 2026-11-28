import type { RouteObject } from 'react-router';
import CharactersPage from './CharactersPage';

// 我的角色卡（#18）。路由由 client/src/App.tsx 自動收集。
export default [{ path: '/characters', element: <CharactersPage /> }] satisfies RouteObject[];
