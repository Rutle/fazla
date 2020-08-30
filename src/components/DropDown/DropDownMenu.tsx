/* eslint-disable react/prop-types */
import React from 'react';
import { useDropdownMenu } from 'react-overlays';

interface FormationDropDownProps {
  listData: string[] | undefined;
  themeColor: string;
  selectedIdx: number;
  selectIndex: (idx: number) => void;
}

const DropDownMenu: React.FC<FormationDropDownProps> = ({ listData, themeColor, selectedIdx, selectIndex }) => {
  const { show, props } = useDropdownMenu({
    flip: true,
    offset: [0, 8],
  });
  return (
    <div
      {...props}
      role="menu"
      className={`formation-dropdown-menu ${themeColor}`}
      style={{
        opacity: `${show ? '1' : '0'}`,
        height: `${show ? 'auto' : '0'}`,
      }}
    >
      {listData !== undefined ? (
        listData.map((value, index) => {
          return (
            <button
              key={`${value}${index}`}
              type="button"
              style={{
                display: `${show ? 'flex' : 'none'}`,
              }}
              className={`btn menu-item ${themeColor} ${index === selectedIdx ? 'active' : ''}`}
              onClick={(e) => {
                selectIndex(index);
              }}
            >
              <span>{value}</span>
            </button>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default DropDownMenu;
