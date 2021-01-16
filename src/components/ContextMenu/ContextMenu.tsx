/* eslint-disable react/prop-types */
import React from 'react';

interface ContextMenuProps {
  menu: JSX.Element;
  xPos: string;
  yPos: string;
  showMenu: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ menu, xPos, yPos, showMenu }) => {
  return (
    <>
      {showMenu ? (
        <div
          className="context-menu-container"
          style={{
            top: yPos,
            left: xPos,
          }}
        >
          {menu}
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};
export default ContextMenu;
