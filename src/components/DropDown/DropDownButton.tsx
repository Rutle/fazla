import React from 'react';
import Dropdown from 'react-overlays/Dropdown';
import DropDownMenu from './DropDownMenu';
import DropDownToggle from './DropDownToggle';

interface DropDownButtonProps {
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

const DropDownButton: React.FC<DropDownButtonProps> = ({
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
    {({ props }) => (
      <div {...props} id="formation-dropdown" style={{ display: 'inline-flex' }}>
        <DropDownToggle
          id="dropdown-toggle"
          text={selectedIdx === undefined || listData.length === 0 ? 'Formations' : listData[selectedIdx]}
          themeColor={themeColor}
        />
        <DropDownMenu
          listData={listData}
          themeColor={themeColor}
          selectedIdx={selectedIdx}
          selectIndex={selectIndex}
          onSelect={onSelect}
        />
      </div>
    )}
  </Dropdown>
);

export default DropDownButton;
