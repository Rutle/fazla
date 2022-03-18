import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import { selectFormation } from '_/reducers/slices/formationGridSlice';

import DropDownButton from './CustomDropDown';

const FormationDropDown: React.FC = () => {
  const dispatch = useDispatch();
  const fData = useSelector((state: RootState) => state.formationGrid);
  const config = useSelector((state: RootState) => state.config);
  const listData = fData.formations.map((item) => item.name);
  const [show, setShow] = useState(false);

  const selectIndex = (idx: number) => {
    dispatch(selectFormation(idx));
  };
  return (
    <DropDownButton
      options={{
        toggleText:
          fData.selectedIndex === undefined || listData.length === 0 ? 'Formations' : listData[fData.selectedIndex],
        dropdownClass: 'formation',
        toggleSize: 'normal',
        themeColor: config.themeColor,
        listLimit: 10,
      }}
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
      drop="down"
      alignEnd
      selectedIdx={fData.selectedIndex}
      listData={listData}
      selectIndex={selectIndex}
      onSelect={setShow}
    />
  );
};

export default FormationDropDown;
