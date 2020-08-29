import React from 'react';
import { useDropdownToggle } from 'react-overlays';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

interface DropDownToggleProps {
  id: string;
  text: string;
}

// eslint-disable-next-line react/prop-types
const DropDownToggle: React.FC<DropDownToggleProps> = ({ id, text }) => {
  const ctrl = useDropdownToggle();
  return (
    <button
      type="button"
      id={id}
      {...ctrl[0]}
      onClick={(e) => ctrl[1].toggle(ctrl[1].show, e)}
      className={`toggle dark ${ctrl[1].show ? 'active' : ''}`}
    >
      {text}
      <div className={`toggle-icon ${ctrl[1].show ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </div>
    </button>
  );
};

export default DropDownToggle;
