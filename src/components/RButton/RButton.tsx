/* eslint-disable react/prop-types */
import * as React from 'react';

interface RButtonProps {
  className?: string;
  children: React.ReactNode;
  themeColor: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  disabled?: boolean;
  extraStyle?: React.CSSProperties;
}

const RButton: React.FC<RButtonProps> = React.memo(
  ({ className = 'btn normal graphic', children, themeColor, onClick, disabled, extraStyle }) => {
    return (
      <button
        type="button"
        className={`${className} ${themeColor}`}
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
