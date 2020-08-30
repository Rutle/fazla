import React, { useState } from 'react';
import DropDownButton from './DropDownButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers/rootReducer';
import { selectFormation } from '../../reducers/slices/appStateSlice';

const FormationDropDown: React.FC = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const [show, setShow] = useState(false);

  const selectIndex = (idx: number) => {
    dispatch(selectFormation(idx));
  };

  return (
    <DropDownButton
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
      drop="down"
      alignEnd={true}
      selectedIdx={appState.formationPage.selectedIndex}
      listData={appState.formationPage.formations.map((item) => item.name)}
      themeColor={appState.themeColor}
      selectIndex={selectIndex}
    />
  );
};

export default FormationDropDown;
