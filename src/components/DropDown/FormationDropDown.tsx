import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import { selectFormation } from '_/reducers/slices/formationGridSlice';
import DropDownButton from './DropDownButton';

const FormationDropDown: React.FC = () => {
  const dispatch = useDispatch();
  const fData = useSelector((state: RootState) => state.formationGrid);
  const config = useSelector((state: RootState) => state.config);
  const [show, setShow] = useState(false);

  const selectIndex = (idx: number) => {
    dispatch(selectFormation(idx));
  };
  useEffect(() => {
    console.log('dropdown button show', show);
  }, [show]);
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
