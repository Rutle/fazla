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

// https://icons.getbootstrap.com/icons/square/
const MaxIcon: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg
      width="12"
      height="12"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-color)`}
      fill={`var(--main-${themeColor}-color)`}
    >
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
    </svg>
  );
};

// https://icons.getbootstrap.com/icons/x/
const CloseIcon: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-color)`}
      fill={`var(--main-${themeColor}-color)`}
    >
      <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
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

const ListIcon: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-color)`}
      fill={`var(--main-${themeColor}-color)`}
    >
      <path
        fillRule="evenodd"
        d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
};

export { MinIcon, MaxIcon, CloseIcon, RestoreIcon, CaretLeft, ListIcon };
