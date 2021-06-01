/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useDropdownMenu } from 'react-overlays';

interface FormationDropDownProps {
  listData: string[] | undefined;
  themeColor: string;
  selectedIdx: number;
  selectIndex: (idx: number) => void;
  onSelect: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDownMenu: React.FC<FormationDropDownProps> = ({
  listData,
  themeColor,
  selectedIdx,
  selectIndex,
  onSelect,
}) => {
  const [menuProps, { show }] = useDropdownMenu({
    flip: true,
    offset: [0, 8],
  });
  console.log(menuProps);
  return (
    <div
      {...menuProps}
      role="menu"
      className={`formation-dropdown-menu ${themeColor}`}
      style={{
        opacity: `${show ? '1' : '0'}`,
      }}
    >
      {listData !== undefined ? (
        listData.map((value, index) => {
          return (
            <button
              key={`${value}-${index}-data`}
              type="button"
              style={{
                display: `${show ? 'flex' : 'none'}`,
              }}
              className={`btn normal menu-item ${themeColor} ${index === selectedIdx ? 'selected' : ''}`}
              onClick={() => {
                selectIndex(index);
                onSelect(!show);
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
