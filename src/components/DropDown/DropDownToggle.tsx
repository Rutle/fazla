import React, { useEffect, useState } from 'react';
import { useDropdownToggle } from 'react-overlays';
import { CaretLeft } from '_/components/Icons';

interface DropDownToggleProps {
  id: string;
  text: string;
  themeColor: string;
}

const DropDownToggle: React.FC<DropDownToggleProps> = ({ id, text, themeColor }) => {
  // const ctrl = useDropdownToggle();
  const [props, { show }] = useDropdownToggle();
  const [isFocusOutline, setFocusOutline] = useState(false);
  return (
    <button
      type="button"
      id={id}
      {...props}
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
      <div className={`toggle-icon ${show ? 'open' : ''}`}>
        <CaretLeft themeColor={themeColor} />
      </div>
    </button>
  );
};

export default DropDownToggle;
