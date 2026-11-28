import { Link, useLocation, useNavigate } from 'react-router';
import HeaderAccountActions from './HeaderAccountActions';
import TopNavBackButton from './TopNavBackButton';

// 全站頂部導覽列（project-foundation / app-shell「Top navigation bar」，票 #5）。
// 房間以外的每一頁都用這一條；房間內改用精簡頂欄（票 #6，尚未實作）。
//
// 連結都用 React Router 的 <Link>，切換頁面不會整頁重新載入。
// TODO(account-auth)：頭像改用登入使用者的 avatarUrl；「登出」接 POST /api/auth/logout。

const NAV_ITEMS = [
  { id: 'home', label: '首頁', href: '/' },
  { id: 'scripts', label: '劇本管理', href: '/scripts' },
  { id: 'characters', label: '我的角色', href: '/characters' },
  { id: 'resources', label: '教學與資源', href: '/resources' },
] as const;

type NavSection = (typeof NAV_ITEMS)[number]['id'];

/** 依網址判斷目前在哪個區塊；不屬於任何區塊（例如加入房間頁）時回傳 null。 */
function sectionFromPath(pathname: string): NavSection | null {
  const match = NAV_ITEMS.find((item) =>
    item.href === '/'
      ? pathname === '/'
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.id ?? null;
}

interface TopNavProps {
  /** 目前所在區塊；不傳時依網址判斷。 */
  current?: NavSection | null;
}

export default function TopNav({ current }: TopNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const section = current === undefined ? sectionFromPath(pathname) : current;
  // 返回鍵：首頁（登入前、登入後都是 /）不顯示，其他頁面都顯示，一律回首頁。
  const showBack = pathname !== '/';

  return (
    <header className="top-nav">
      <div className="top-nav__start">
        {showBack && (
          <TopNavBackButton label="返回首頁" onClick={() => navigate('/')} />
        )}
        <Link className="top-nav__logo" to="/">
          TAKOYAKI
        </Link>
      </div>
      <nav className="top-nav__items" aria-label="網站導覽">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            className="top-nav__item"
            to={item.href}
            aria-current={item.id === section ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <HeaderAccountActions />
    </header>
  );
}
