import './TopNav.css';

interface TopNavBackButtonProps {
  label: string;
  onClick: () => void;
}

export default function TopNavBackButton({ label, onClick }: TopNavBackButtonProps) {
  return (
    <button type="button" className="top-nav__icon top-nav__back" aria-label={label} onClick={onClick}>
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
  );
}
