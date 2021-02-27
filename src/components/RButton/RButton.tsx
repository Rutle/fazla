import React, { useState } from 'react';

interface RButtonProps {
  className?: string;
  id?: string;
  children: React.ReactNode;
  themeColor?: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  onRightClick?(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  disabled?: boolean;
  extraStyle?: React.CSSProperties;
  role?: string;
}

const RButton: React.FC<RButtonProps> = React.memo(
  ({ className = 'btn normal', children, themeColor = '', onClick, onRightClick, disabled, extraStyle, id, role }) => {
    const [isFocusOutline, setFocusOutline] = useState(false);
    return (
      <button
        role={role}
        id={id}
        onKeyUp={(e) => {
          if (e.key === 'Tab') {
            setFocusOutline(true);
          }
        }}
        onMouseUp={() => {
          if (isFocusOutline) setFocusOutline(false);
        }}
        onContextMenu={onRightClick}
        type="button"
        className={`${className} ${themeColor} ${!isFocusOutline ? 'no-focus-outline' : ''}`}
        onClick={onClick}
        disabled={disabled}
        style={extraStyle}
      >
        {children}
      </button>
    );
  }
);
export default RButton;
