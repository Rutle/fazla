import React from 'react';
import { useDropdownToggle } from 'react-overlays';

interface DropDownToggleProps {
  id: string;
  children: JSX.Element;
}

// eslint-disable-next-line react/prop-types
const DropDownToggle: React.FC<DropDownToggleProps> = ({ id, children }) => {
  const ctrl = useDropdownToggle();
  return (
    <button
      type="button"
      id={id}
      {...ctrl[0]}
      onClick={(e) => ctrl[1].toggle(ctrl[1].show, e)}
      className={`toggle dark ${ctrl[1].show ? 'active' : ''}`}
    >
      {children}
    </button>
  );
};

export default DropDownToggle;
