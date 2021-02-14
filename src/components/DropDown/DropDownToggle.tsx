import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDropdownToggle } from 'react-overlays';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

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
      <div className={`toggle-icon ${ctrl[1].show ? 'open' : ''}`}>{/* <FontAwesomeIcon icon={faAngleLeft} /> */}</div>
    </button>
  );
};

export default DropDownToggle;

DropDownToggle.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  themeColor: PropTypes.string.isRequired,
};
