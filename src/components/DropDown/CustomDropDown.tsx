import React, { useCallback, useState } from 'react';
import { Dropdown, useDropdownMenu, useDropdownToggle } from 'react-overlays';
import { CaretDown } from '../Icons';

const DropDownMenuItem: React.FC<{
  themeColor: string;
  isSelected: boolean;
  text: string;
  index: number;
  onClick: (index: number) => void;
}> = React.memo(({ themeColor, isSelected, text, index, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(index);
  }, [onClick, index]);
  // console.log('render menu item button', text);
  return (
    <button
      type="button"
      className={`btn normal menu-item ${themeColor} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <span>{text}</span>
    </button>
  );
});

interface FormationDropDownProps {
  listData: string[] | undefined;
  themeColor: string;
  selectedIdx: number;
  menuClass: string;
  selectIndex: (idx: number) => void;
  onSelect: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDownMenu: React.FC<FormationDropDownProps> = React.memo(
  ({ listData, themeColor, selectedIdx, menuClass, selectIndex, onSelect }) => {
    const [menuProps, { show }] = useDropdownMenu({
      flip: true,
      offset: [0, 8],
    });
    const click = useCallback(
      (index: number) => {
        selectIndex(index);
        onSelect(!show);
      },
      [onSelect, selectIndex, show]
    );

    return (
      <div
        {...menuProps}
        role="menu"
        className={`dropdown-menu ${menuClass} ${themeColor}`}
        style={{
          display: `${show ? 'flex' : 'none'}`,
        }}
      >
        {listData !== undefined ? (
          listData.map((value, index) => (
            <DropDownMenuItem
              key={`${value}-${index + 1}`}
              text={value}
              isSelected={index === selectedIdx}
              themeColor={themeColor}
              onClick={click}
              index={index}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    );
  }
);

interface DropDownToggleProps {
  text: string;
  themeColor: string;
  toggleClass: string;
}

const DropDownToggle: React.FC<DropDownToggleProps> = React.memo(({ text, themeColor, toggleClass }) => {
  const [props, { show }] = useDropdownToggle();
  const [isFocusOutline, setFocusOutline] = useState(false);
  return (
    <button
      type="button"
      {...props}
      className={`dropdown-toggle ${toggleClass} tab-btn normal ${themeColor} ${
        !isFocusOutline ? 'no-focus-outline' : ''
      }`}
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
      <div className={`btn-icon ${show ? '' : 'close'}`}>
        <CaretDown themeColor={themeColor} />
      </div>
    </button>
  );
});

interface DropDownButtonProps {
  dropdownClass: string;
  toggleText: string;
  show: boolean;
  onToggle: (nextShow: boolean, event?: React.SyntheticEvent<Element, Event> | undefined) => void;
  drop: 'up' | 'down' | 'left' | 'right' | undefined;
  alignEnd: boolean | undefined;
  selectedIdx: number;
  listData: string[];
  themeColor: string;
  selectIndex: (idx: number) => void;
  onSelect: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropDownButton: React.FC<DropDownButtonProps> = ({
  dropdownClass,
  toggleText,
  show,
  onToggle,
  drop,
  alignEnd,
  selectedIdx,
  listData,
  themeColor,
  selectIndex,
  onSelect,
}) => (
  <Dropdown show={show} onToggle={onToggle} drop={drop} alignEnd={alignEnd} itemSelector="button:not(:disabled)">
    <div className={`dropdown ${dropdownClass}`}>
      <DropDownToggle text={toggleText} themeColor={themeColor} toggleClass={dropdownClass} />
      <DropDownMenu
        menuClass={dropdownClass}
        listData={listData}
        themeColor={themeColor}
        selectedIdx={selectedIdx}
        selectIndex={selectIndex}
        onSelect={onSelect}
      />
    </div>
  </Dropdown>
);

export default DropDownButton;
