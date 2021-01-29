/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState } from 'react';

interface RSwitchProps {
  id: string;
  className?: string;
  themeColor: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  checked?: boolean;
  extraStyle?: React.CSSProperties;
}

const RSwitch: React.FC<RSwitchProps> = React.memo(
  ({ id, className = 'switch-label', onChange, checked, extraStyle }) => {
    const [isFocusOutline, setFocusOutline] = useState(false);
    return (
      <div className="switch">
        <label htmlFor={id} className={className} style={extraStyle}>
          <input
            id={id}
            type="checkbox"
            className={`switch-input ${!isFocusOutline ? 'no-focus-outline' : ''}`}
            checked={checked}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                setFocusOutline(true);
              }
            }}
            onMouseUp={() => {
              if (isFocusOutline) setFocusOutline(false);
            }}
          />
          <span className="switch-toggle" />
        </label>
      </div>
    );
  }
);

export default RSwitch;
