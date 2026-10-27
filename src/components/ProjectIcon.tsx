import React from 'react';

interface ProjectIconProps {
  project: string;
  className?: string;
}

export const PROJECT_LIST = [
  'Google Dashboard',
  'Grab Map App',
  'Dribbble',
  'Netflix',
  'Nvidia',
  'Behance',
  'Amazon Dashboard',
  'Microsoft',
  'Apple',
  'Lego',
  'Facebook Dashboard',
  'Figma',
];

export const ProjectIcon: React.FC<ProjectIconProps> = ({ project, className = 'w-5 h-5' }) => {
  const normalized = project.toLowerCase();

  if (normalized.includes('google')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21.805 10.023H12.18v3.955h5.517c-.24 1.27-.965 2.345-2.054 3.066v2.548h3.324c1.946-1.792 3.068-4.432 3.068-7.592 0-.67-.06-1.325-.23-1.977z"
          fill="#4285F4"
        />
        <path
          d="M12.18 22c2.774 0 5.102-.918 6.802-2.488l-3.324-2.548c-.92.618-2.096.985-3.478.985-2.674 0-4.94-1.805-5.748-4.233H2.997v2.63C4.69 19.713 8.165 22 12.18 22z"
          fill="#34A853"
        />
        <path
          d="M6.432 13.716A6.04 6.04 0 0 1 6.11 12c0-.598.11-1.178.322-1.716V7.654H2.997A9.985 9.985 0 0 0 2 12c0 1.615.388 3.14 1.077 4.346l3.355-2.63z"
          fill="#FBBC05"
        />
        <path
          d="M12.18 6.05c1.51 0 2.863.52 3.93 1.54l2.946-2.946C17.277 2.99 14.954 2 12.18 2 8.165 2 4.69 4.287 2.997 7.654l3.435 2.63c.808-2.428 3.074-4.234 5.748-4.234z"
          fill="#EA4335"
        />
      </svg>
    );
  }

  if (normalized.includes('grab')) {
    return (
      <div className="inline-flex items-center justify-center px-1 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 shrink-0">
        <span className="text-[10px] font-extrabold tracking-tighter text-[#00B14F] leading-none">
          Grab
        </span>
      </div>
    );
  }

  if (normalized.includes('dribbble')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#EA4C89" />
        <path
          d="M12 3.5c2.2 0 4.2.85 5.7 2.25-1.35 1.85-3.45 3.1-5.95 3.65-.9-1.95-1.9-3.75-2.95-5.35A8.45 8.45 0 0 1 12 3.5zm-4.8 1.3c1.05 1.55 2.05 3.35 2.95 5.3-2.25.4-4.65.45-6.6.15.65-2.35 2.15-4.35 3.65-5.45zM3.5 12v-.3c2.2.3 4.85.2 7.3-.25.3.65.6 1.3.85 1.95-2.85.9-5.3 2.75-6.85 5.05A8.46 8.46 0 0 1 3.5 12zm8.5 8.5c-2.15 0-4.1-.8-5.6-2.1 1.4-2.15 3.65-3.85 6.35-4.65.65 1.85 1.15 3.85 1.45 5.95-.7.5-1.45.8-2.2.8zm3.7-1.4c-.25-1.9-.75-3.75-1.35-5.5 1.85-.3 3.8-.1 5.65.55-.5 2.2-1.95 4.05-4.3 4.95zm-1.9-7.15c-.25-.6-.5-1.25-.8-1.85 2.25-.55 4.25-1.75 5.6-3.5a8.42 8.42 0 0 1 1.85 4.95c-2.15-.55-4.45-.5-6.65.4z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  if (normalized.includes('netflix')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 3h3.6v18H5V3zm10.4 0H19v18h-3.6V3z" fill="#B1060F" />
        <path d="M5 3h3.6l10.4 18h-3.6L5 3z" fill="#E50914" />
      </svg>
    );
  }

  if (normalized.includes('nvidia')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#76B900" />
        <path
          d="M11.5 8.2c-2.8 0-4.9 2.1-4.9 3.8 0 1.7 2.1 3.8 4.9 3.8 1.7 0 3.2-.8 4.1-2l-1.5-1.1c-.6.8-1.5 1.3-2.6 1.3-1.6 0-2.9-1-2.9-2s1.3-2 2.9-2c1.1 0 2 .5 2.6 1.3l1.5-1.1c-.9-1.2-2.4-2-4.1-2z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  if (normalized.includes('behance')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#0057FF" />
        <text
          x="12"
          y="15.5"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9.5"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          Bē
        </text>
      </svg>
    );
  }

  if (normalized.includes('amazon')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <text
          x="12"
          y="15"
          textAnchor="middle"
          className="fill-slate-900 dark:fill-white"
          fontSize="16"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          a
        </text>
        <path
          d="M5.5 17.5c3.8 2.4 9.2 2.4 13 0"
          stroke="#FF9900"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16.8 16.5l2.1.8-.6 2.1"
          stroke="#FF9900"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (normalized.includes('microsoft')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="8.2" height="8.2" fill="#F25022" />
        <rect x="12.8" y="3" width="8.2" height="8.2" fill="#7FBA00" />
        <rect x="3" y="12.8" width="8.2" height="8.2" fill="#00A4EF" />
        <rect x="12.8" y="12.8" width="8.2" height="8.2" fill="#FFB900" />
      </svg>
    );
  }

  if (normalized.includes('apple')) {
    return (
      <svg
        className={`${className} text-slate-900 dark:text-white`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.365 14.33c-.025-2.29 1.87-3.39 1.955-3.445-1.07-1.56-2.73-1.775-3.315-1.8-1.405-.145-2.755.83-3.47.83-.715 0-1.81-.81-2.98-.79-1.53.025-2.945.89-3.73 2.26-1.595 2.765-.405 6.85 1.14 9.09.76 1.095 1.66 2.325 2.845 2.28 1.145-.045 1.575-.74 2.96-.74 1.38 0 1.77.74 2.98.715 1.23-.02 2.01-1.115 2.76-2.215.875-1.275 1.235-2.51 1.255-2.575-.03-.015-2.375-.91-2.4-3.61zM14.12 7.57c.63-.765 1.055-1.825.94-2.885-.91.035-2.015.605-2.665 1.37-.575.665-1.08 1.75-.945 2.785 1.015.08 2.04-.505 2.67-1.27z" />
      </svg>
    );
  }

  if (normalized.includes('lego')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#D01012" />
        <text
          x="12"
          y="14.5"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="6.5"
          fontWeight="900"
          fontFamily="sans-serif"
        >
          LEGO
        </text>
      </svg>
    );
  }

  if (normalized.includes('facebook')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#1877F2" />
        <path
          d="M15.1 12.6h-2v7.4h-3v-7.4H8.5V10h1.6V8.3c0-2.1 1.1-3.3 3.3-3.3.9 0 1.8.15 1.8.15v2.1h-1c-1 0-1.1.5-1.1 1.2V10h2.2l-.2 2.6z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  if (normalized.includes('figma')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8.5 2h3.5v7H8.5a3.5 3.5 0 1 1 0-7z" fill="#F24E1E" />
        <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" fill="#FF7262" />
        <path d="M12 9h3.5a3.5 3.5 0 1 1 0 7H12V9z" fill="#1ABCFE" />
        <path d="M8.5 9H12v7H8.5a3.5 3.5 0 1 1 0-7z" fill="#A259FF" />
        <path d="M8.5 16H12v3.5a3.5 3.5 0 1 1-3.5-3.5z" fill="#0ACF83" />
      </svg>
    );
  }

  const initials = project
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0">
      {initials || 'TF'}
    </span>
  );
};
