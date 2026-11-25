// 房間大廳用的線條圖示（inline SVG，不另外裝圖示套件）。顏色跟隨文字色 currentColor。

const PATHS = {
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  play: <path d="M7 5v14l12-7z" fill="currentColor" />,
  bolt: <path d="M13 2L5 14h6l-1 8 8-12h-6z" />,
  sparkle: (
    <path
      d="M12 2c.6 5.3 4.7 9.4 10 10-5.3.6-9.4 4.7-10 10-.6-5.3-4.7-9.4-10-10 5.3-.6 9.4-4.7 10-10z"
      fill="currentColor"
      stroke="none"
    />
  ),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  heart: (
    <path
      d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"
      fill="currentColor"
      stroke="none"
    />
  ),
  brain: (
    <>
      <path
        d="M11 4.5a3.5 3.5 0 0 0-6.5 1.8A3.5 3.5 0 0 0 4 12.5a3.5 3.5 0 0 0 3 5.4A3 3 0 0 0 11 19.5z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M13 4.5a3.5 3.5 0 0 1 6.5 1.8 3.5 3.5 0 0 1 .5 6.2 3.5 3.5 0 0 1-3 5.4 3 3 0 0 1-4 1.6z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  arrowUpRight: <path d="M7 17L17 7M8 7h9v9" />,
} as const;

export type LobbyIconName = keyof typeof PATHS;

interface LobbyIconProps {
  name: LobbyIconName;
  size?: number;
  className?: string;
}

export default function LobbyIcon({ name, size = 20, className }: LobbyIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
