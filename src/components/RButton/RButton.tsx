import React, { useState } from 'react';
import { UseDragAndDropFunctions } from '../DragAndDrop/useDragAndDrop';

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
  dragProps?: {
    dragFunctions?: UseDragAndDropFunctions;
    dragOptions?: { [key in 'draggable']: any };
    data?: { [key: string]: any };
  };
}

const RButton: React.FC<RButtonProps> = React.memo(
  ({
    className = 'btn normal',
    children,
    themeColor = '',
    onClick,
    onRightClick,
    disabled,
    extraStyle,
    id,
    role,
    dragProps,
  }) => {
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
        className={`${className} ${themeColor}${!isFocusOutline ? ' no-focus-outline' : ''}`}
        onClick={onClick}
        disabled={disabled}
        style={extraStyle}
        {...dragProps?.dragFunctions}
        {...dragProps?.dragOptions}
        {...dragProps?.data}
      >
        {children}
      </button>
    );
  }
);
export default RButton;
