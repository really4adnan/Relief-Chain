export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4 6.6a5.4 5.4 0 0 1 7.6 0l4.4 4.4a5.4 5.4 0 0 1 0 7.6l-2.6 2.6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M18.6 25.4a5.4 5.4 0 0 1-7.6 0l-4.4-4.4a5.4 5.4 0 0 1 0-7.6l2.6-2.6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}
