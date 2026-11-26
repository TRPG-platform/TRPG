import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import './TopNav.css';

const NAV_ITEMS = [
  { id: 'home', label: '首頁', href: '/' },
  { id: 'scripts', label: '劇本管理', href: '/scripts' },
  { id: 'characters', label: '我的角色', href: '/characters' },
  { id: 'resources', label: '教學與資源', href: '/resources' },
] as const;

type NavSection = (typeof NAV_ITEMS)[number]['id'];

function sectionFromPath(pathname: string): NavSection | null {
  const match = NAV_ITEMS.find((item) =>
    item.href === '/'
      ? pathname === '/'
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.id ?? null;
}

interface TopNavProps {
  current?: NavSection | null;
}

export default function TopNav({ current }: TopNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const section = current === undefined ? sectionFromPath(pathname) : current;
  const showBack = pathname !== '/';

  return (
    <header className="top-nav">
      <div className="top-nav__start">
        {showBack && (
          <button
            type="button"
            className="top-nav__icon top-nav__back"
            aria-label="返回首頁"
            onClick={() => navigate('/')}
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
              <path d="M20 12H9" />
              <path d="M13 7l-5 5 5 5" />
            </svg>
          </button>
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
      <div className="top-nav__icons">
        <button type="button" className="top-nav__icon" aria-label="通知">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </button>
        <AvatarMenu />
      </div>
    </header>
  );
}

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === 'Escape'
          : !ref.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div className="top-nav__avatar" ref={ref}>
      <button
        type="button"
        className="top-nav__icon"
        aria-label="帳號選單"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          viewBox="0 0 28 28"
          width="28"
          height="28"
          aria-hidden="true"
          className="top-nav__avatar-svg"
        >
          <circle cx="14" cy="14" r="14" className="top-nav__avatar-bg" />
          <circle cx="14" cy="11" r="4.6" className="top-nav__avatar-fg" />
          <path
            d="M5.6 22.6c1.9-3.6 5-5.3 8.4-5.3s6.5 1.7 8.4 5.3"
            className="top-nav__avatar-fg"
          />
        </svg>
      </button>
      {open && (
        <div className="top-nav__menu" role="menu">
          <Link role="menuitem" className="top-nav__menu-item" to="/account">
            帳號設定
          </Link>
          <button
            type="button"
            role="menuitem"
            className="top-nav__menu-item"
            onClick={() => {
              setOpen(false);
              navigate('/');
            }}
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}
