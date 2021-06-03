import React from 'react';

const MinIcon: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  return (
    <svg width="10" height="10" aria-hidden="true">
      <path
        fill={`var(--main-${themeColor}-titlebar-color)`}
        strokeLinecap="round"
        stroke={`var(--main-${themeColor}-titlebar-color)`}
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
      stroke={`var(--main-${themeColor}-titlebar-color)`}
      fill={`var(--main-${themeColor}-titlebar-color)`}
    >
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
    </svg>
  );
};

// https://icons.getbootstrap.com/icons/x/
const CloseIcon: React.FC<{ themeColor: string; width?: string; height?: string; className?: string }> = ({
  themeColor,
  width = '16',
  height = '16',
  className = '',
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-titlebar-color)`}
      fill={`var(--main-${themeColor}-titlebar-color)`}
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
        stroke={`var(--main-${themeColor}-titlebar-color)`}
        fill={`var(--main-${themeColor}-titlebar-color)`}
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

const ArrowDegUp: React.FC<{ themeColor: string; width?: string; height?: string; className?: string }> = ({
  themeColor,
  width = '16px',
  height = '16px',
  className = '',
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-titlebar-color)`}
      fill={`var(--main-${themeColor}-titlebar-color)`}
    >
      <path
        fillRule="evenodd"
        d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z"
      />
    </svg>
  );
};

// https://icons.getbootstrap.com/icons/plus/
const PlusIcon: React.FC<{ themeColor: string; width?: string; height?: string; className?: string }> = ({
  themeColor,
  width = '16px',
  height = '16px',
  className = 'icon',
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-titlebar-color)`}
      fill={`var(--main-${themeColor}-titlebar-color)`}
    >
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
  );
};

const BoxArrowUp: React.FC<{ themeColor: string; width?: string; height?: string; className?: string }> = ({
  themeColor,
  width = '16px',
  height = '16px',
  className = 'icon',
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      stroke={`var(--main-${themeColor}-titlebar-color)`}
      fill={`var(--main-${themeColor}-titlebar-color)`}
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1h-2z"
      />
      <path
        fillRule="evenodd"
        d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"
      />
    </svg>
  );
};

// https://icons.getbootstrap.com/icons/dash/
const DashIcon: React.FC<{ themeColor: string; width?: string; height?: string; className?: string }> = ({
  themeColor,
  width = '16px',
  height = '16px',
  className = 'icon',
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-titlebar-color)`}
      fill={`var(--main-${themeColor}-titlebar-color)`}
    >
      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
    </svg>
  );
};

// https://icons.getbootstrap.com/icons/dash/
const QuestionCircleIcon: React.FC<{ themeColor: string; width?: string; height?: string; className?: string }> = ({
  themeColor,
  width = '16px',
  height = '16px',
  className = 'icon',
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      stroke={`var(--main-${themeColor}-titlebar-color)`}
      fill={`var(--main-${themeColor}-titlebar-color)`}
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
    </svg>
  );
};

export {
  MinIcon,
  MaxIcon,
  CloseIcon,
  RestoreIcon,
  CaretLeft,
  ArrowDegUp,
  PlusIcon,
  DashIcon,
  QuestionCircleIcon,
  BoxArrowUp,
};
