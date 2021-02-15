import React from 'react';

const MinIcon: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg width="10" height="10" aria-hidden="true">
      <path
        fill={`var(--main-${themeColor}-color)`}
        strokeLinecap="round"
        stroke={`var(--main-${themeColor}-color)`}
        strokeWidth="2"
        d="M0 5h10v1H0z"
      />
    </svg>
  );
};

const MaxIcon: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg width="10" height="10" aria-hidden="true">
      <path
        strokeLinecap="round"
        fill={`var(--main-${themeColor}-color)`}
        stroke={`var(--main-${themeColor}-color)`}
        strokeWidth="2"
        d="M0 0v10h10V0zm1 1h8v8H1z"
      />
    </svg>
  );
};

const CloseIcon: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg width="10" height="10" aria-hidden="true">
      <path
        strokeLinecap="round"
        stroke={`var(--main-${themeColor}-color)`}
        fill={`var(--main-${themeColor}-color)`}
        strokeWidth="2"
        d="M0 0v.7L4.3 5 0 9.3v.7h.7L5 5.7 9.3 10h.7v-.7L5.7 5 10 .7V0h-.7L5 4.3.7 0z"
      />
    </svg>
  );
};

const RestoreIcon: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg width="10" height="10" aria-hidden="true">
      <path
        strokeLinecap="round"
        stroke={`var(--main-${themeColor}-color)`}
        fill={`var(--main-${themeColor}-color)`}
        strokeWidth="2"
        d="M2 0v2H0v8h8V8h2V0zm1 1h6v6H8V2H3zM1 3h6v6H1z"
      />
    </svg>
  );
};

// https://icons.getbootstrap.com/icons/caret-left/
const CaretLeft: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg
      width="10"
      height="10"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-color)`}
      fill={`var(--main-${themeColor}-color)`}
    >
      <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753l-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
    </svg>
  );
};

export { MinIcon, MaxIcon, CloseIcon, RestoreIcon, CaretLeft };
