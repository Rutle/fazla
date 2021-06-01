import React, { useState } from 'react';
import { Dropdown, useDropdownMenu, useDropdownToggle } from 'react-overlays';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import { selectFormation } from '_/reducers/slices/formationGridSlice';
import { CaretLeft } from '../Icons';

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
              key={`${value}-${index * listData.length}-data`}
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
interface DropDownToggleProps {
  id: string;
  text: string;
  themeColor: string;
}

const DropDownToggle: React.FC<DropDownToggleProps> = ({ id, text, themeColor }) => {
  const [props, { show }] = useDropdownToggle();
  const [isFocusOutline, setFocusOutline] = useState(false);
  return (
    <button
      type="button"
      id={id}
      {...props}
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
      <div className={`toggle-icon ${show ? 'open' : ''}`}>
        <CaretLeft themeColor={themeColor} />
      </div>
    </button>
  );
};

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
    <div id="formation-dropdown">
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
  </Dropdown>
);

const FormationDropDown: React.FC = () => {
  const dispatch = useDispatch();
  const fData = useSelector((state: RootState) => state.formationGrid);
  const config = useSelector((state: RootState) => state.config);
  const [show, setShow] = useState(false);

  const selectIndex = (idx: number) => {
    dispatch(selectFormation(idx));
  };
  return (
    <DropDownButton
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
      drop="down"
      alignEnd
      selectedIdx={fData.selectedIndex}
      listData={fData.formations.map((item) => item.name)}
      themeColor={config.themeColor}
      selectIndex={selectIndex}
      onSelect={setShow}
    />
  );
};

export default FormationDropDown;
