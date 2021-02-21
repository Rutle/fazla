import React, { useState } from 'react';
import { useDropdownToggle } from 'react-overlays';
import { CaretLeft } from '_/components/Icons';

interface DropDownToggleProps {
  id: string;
  text: string;
  themeColor: string;
}

const DropDownToggle: React.FC<DropDownToggleProps> = ({ id, text, themeColor }) => {
  const ctrl = useDropdownToggle();
  const [isFocusOutline, setFocusOutline] = useState(false);
  return (
    <button
      type="button"
      id={id}
      {...ctrl[0]}
      onClick={(e) => {
        ctrl[1].toggle(ctrl[1].show, e);
      }}
      className={`dropdown-toggle tab-btn normal ${themeColor} ${!isFocusOutline ? 'no-focus-outline' : ''}`}
      onKeyUp={(e) => {
        if (e.key === 'Tab') {
          setFocusOutline(true);
        }
      }}
      onMouseUp={() => {
        if (isFocusOutline) setFocusOutline(false);
      }}
    >
      <span>{text}</span>
      <div className={`toggle-icon ${ctrl[1].show ? 'open' : ''}`}>
        <CaretLeft themeColor={themeColor} />
      </div>
    </button>
  );
};

export default DropDownToggle;
