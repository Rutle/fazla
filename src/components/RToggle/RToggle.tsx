/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState } from 'react';

interface RToggleProps {
  id: string;
  value: string;
  className?: string;
  children: React.ReactNode;
  themeColor: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  selected: boolean;
  extraStyle?: React.CSSProperties;
}

const RToggle: React.FC<RToggleProps> = React.memo(
  ({ id, value, className = 'btn normal', children, themeColor, onChange, selected, extraStyle }) => {
    const [isFocusOutline, setFocusOutline] = useState(false);
    return (
      <label
        className={`${className} ${themeColor}${selected ? ' selected' : ''} ${
          !isFocusOutline ? 'no-focus-outline' : ''
        }`}
        htmlFor={`${id}-input`}
        style={extraStyle}
      >
        {children}
        <input
          id={`${id}-input`}
          value={value}
          type="radio"
          checked={selected}
          onChange={onChange}
          onClick={(e) => {
            const { clientX, clientY } = e;
            if (clientX !== 0 && clientY !== 0) {
              setFocusOutline(false);
            } else {
              setFocusOutline(true);
            }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Tab' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              setFocusOutline(true);
            }
          }}
        />
      </label>
    );
  }
);

export default RToggle;
