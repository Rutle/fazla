import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '_/App';
import { RootState } from '_/reducers/rootReducer';
import { Ship } from '_/types/shipTypes';
import { parseFits } from '_/utils/appUtilities';
import DropDownButton from './DropDown/CustomDropDown';

const EqDropDown: React.FC<{ text: string; listData: string[] }> = ({ text, listData }) => {
  const config = useSelector((state: RootState) => state.config);
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <DropDownButton
      dropdownClass="equipment"
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
      drop="down"
      alignEnd
      selectedIdx={selectedIndex}
      listData={listData}
      themeColor={config.themeColor}
      selectIndex={setSelectedIndex}
      onSelect={setShow}
      toggleText="test"
    />
  );
  // return <div>{text}</div>;
};

const FormationEquipment: React.FC<{ fleet: Ship[] }> = ({ fleet }) => {
  // console.log(`Render FormationEquipment`);
  const { shipData } = useContext(AppContext);

  return (
    <>
      {fleet.map((ship, idxf) => {
        if (!ship)
          return (
            <div key={`none-${idxf + 1}`} className="f-column">
              <div>None</div>
              <div>None</div>
              <div>None</div>
            </div>
          );
        return (
          <div key={ship.names.en} className="f-column">
            {parseFits(ship.slots, shipData, ship.retrofit).map((slot) => {
              return Object.values(slot).map((eq, eqIdx) => (
                <EqDropDown key={`${ship.names.en}-eq-menu-${eqIdx + 1}`} text="test" listData={eq[eqIdx]} />
              ));
            })}
          </div>
        );
      })}
    </>
  );
};

export default React.memo(FormationEquipment);
