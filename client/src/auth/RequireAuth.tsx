import { Navigate, Outlet, useLocation } from 'react-router';
import { loginPath, useSignedIn } from './session';

// 路由守衛（票 #10）：首頁與登入頁以外都需要登入，
// 未登入導向登入頁，並記下原本要去的頁面，登入後回到那裡。

const PUBLIC_PATHS = new Set(['/', '/login']);

export default function RequireAuth() {
  const signedIn = useSignedIn();
  const { pathname, search, hash } = useLocation();

  if (!signedIn && !PUBLIC_PATHS.has(pathname)) {
    return <Navigate to={loginPath(pathname + search + hash)} replace />;
  }
  return <Outlet />;
}
