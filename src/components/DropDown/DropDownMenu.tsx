import React from 'react';
import { useDropdownMenu } from 'react-overlays';

interface FormationDropDownProps {
  role: string;
}

const DropDownMenu: React.FC = () => {
  const { show, props } = useDropdownMenu({
    flip: true,
    offset: [0, 8],
  });
  return (
    <div
      {...props}
      role="menu"
      className="formation-dropdown-menu dark"
      style={{
        display: `${show ? 'flex' : 'none'}`,
      }}
    >
      <button type="button" className="btn menu-item dark">
        Item 1
      </button>
      <button type="button" className="btn menu-item dark">
        Item 2
      </button>
    </div>
  );
};

export default DropDownMenu;
