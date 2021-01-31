/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState } from 'react';

interface RButtonProps {
  className?: string;
  children: React.ReactNode;
  themeColor?: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  disabled?: boolean;
  extraStyle?: React.CSSProperties;
}

const RButton: React.FC<RButtonProps> = React.memo(
  ({ className = 'btn normal graphic', children, themeColor = '', onClick, disabled, extraStyle }) => {
    const [isFocusOutline, setFocusOutline] = useState(false);
    return (
      <button
        onKeyUp={(e) => {
          if (e.key === 'Tab') {
            setFocusOutline(true);
          }
        }}
        onMouseUp={() => {
          if (isFocusOutline) setFocusOutline(false);
        }}
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
