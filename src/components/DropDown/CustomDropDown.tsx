import React, { useCallback, useState } from 'react';
import { Dropdown, useDropdownMenu, useDropdownToggle } from 'react-overlays';
import { FixedSizeList as List } from 'react-window';
import { CaretDown } from '../Icons';

export interface CustomDDConf {
  dropdownClass: 'formation' | 'equipment';
  toggleText: string;
  toggleSize: 'small' | 'normal';
  listLimit?: number;
  themeColor: 'dark' | 'light';
}

const DropDownMenuItem: React.FC<{
  themeColor: string;
  isSelected: boolean;
  text: string;
  index: number;
  style?: React.CSSProperties;
  onClick: (index: number) => void;
}> = React.memo(({ themeColor, isSelected, text, index, style, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(index);
  }, [onClick, index]);
  return (
    <button
      type="button"
      className={`small rounded menu-item ${themeColor} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={style}
    >
      <span>{text}</span>
    </button>
  );
});

interface FormationDropDownProps {
  options: CustomDDConf;
  listData: string[] | undefined;
  selectedIdx: number | undefined;
  selectIndex: (idx: number) => void;
  onSelect: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDownMenu: React.FC<FormationDropDownProps> = ({ options, listData, selectedIdx, selectIndex, onSelect }) => {
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

  const getCount = (limit: number, data: string[]) => {
    if (data.length < limit) return data.length;
    return limit;
  };

  return (
    <div
      {...menuProps}
      role="menu"
      className={`dropdown-menu ${options.dropdownClass} ${options.themeColor}`}
      style={{
        display: `${show ? 'flex' : 'none'}`,
      }}
    >
      {listData ? (
        <List
          height={options.listLimit && listData ? getCount(options.listLimit, listData) * 23 : '100%'}
          itemCount={listData.length}
          itemSize={23}
          width="100%"
        >
          {({ index, style }) => {
            return (
              <DropDownMenuItem
                key={`${listData[index]}-${index + 1}`}
                text={listData[index]}
                isSelected={index === selectedIdx && typeof selectedIdx !== 'undefined'}
                themeColor={options.themeColor}
                onClick={click}
                index={index}
                style={{ ...style, top: (style.top as number) + 1, height: 22, width: 'calc(100% - 4px)' }}
              />
            );
          }}
        </List>
      ) : (
        <></>
      )}
      {/* options.dropdownClass === 'formation' && listData ? (
        listData.map((value, index) => (
          <DropDownMenuItem
            key={`${value}-${index + 1}`}
            text={value}
            isSelected={index === selectedIdx && typeof selectedIdx !== 'undefined'}
            themeColor={options.themeColor}
            onClick={click}
            index={index}
          />
        ))
      ) : (
        <></>
      ) */}
    </div>
  );
};

interface DropDownToggleProps {
  options: CustomDDConf;
}

const DropDownToggle: React.FC<DropDownToggleProps> = ({ options }) => {
  const [props, { show }] = useDropdownToggle();
  const [isFocusOutline, setFocusOutline] = useState(false);
  return (
    <button
      type="button"
      {...props}
      className={`dropdown-toggle ${options.dropdownClass} tab-btn ${options.toggleSize} ${options.themeColor} ${
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
      <span>{options.toggleText}</span>
      <div className={`btn-icon ${show ? '' : 'close'}`}>
        <CaretDown themeColor={options.themeColor} />
      </div>
    </button>
  );
};

interface DropDownButtonProps {
  options: CustomDDConf;
  show: boolean;
  onToggle: (nextShow: boolean, event?: React.SyntheticEvent<Element, Event> | undefined) => void;
  drop: 'up' | 'down' | 'left' | 'right' | undefined;
  alignEnd: boolean | undefined;
  selectedIdx: number | undefined;
  listData: string[];
  selectIndex: (idx: number) => void;
  onSelect: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropDownButton: React.FC<DropDownButtonProps> = ({
  options,
  show,
  onToggle,
  drop,
  alignEnd,
  selectedIdx,
  listData,
  selectIndex,
  onSelect,
}) => (
  <Dropdown show={show} onToggle={onToggle} drop={drop} alignEnd={alignEnd} itemSelector="button:not(:disabled)">
    <div className={`dropdown ${options.dropdownClass}`}>
      <DropDownToggle options={options} />
      {!show ? (
        <></>
      ) : (
        <DropDownMenu
          options={options}
          listData={listData}
          selectedIdx={selectedIdx}
          selectIndex={selectIndex}
          onSelect={onSelect}
        />
      )}
    </div>
  </Dropdown>
);

export default DropDownButton;
