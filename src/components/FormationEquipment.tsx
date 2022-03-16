import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '_/App';
import { RootState } from '_/reducers/rootReducer';
import { Ship } from '_/types/shipTypes';
import { parseFits } from '_/utils/appUtilities';
import DropDownButton from './DropDown/CustomDropDown';

const EqDropDown: React.FC<{ text: string; listData: string[] }> = ({ text, listData }) => {
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const config = useSelector((state: RootState) => state.config);
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
      toggleText={typeof selectedIndex !== 'undefined' ? listData[selectedIndex] : text}
      // Text need to be either Empty (none in formation data) or Name of equipment from formation data.
    />
  );
  // return <div>{text}</div>;
};

const FormationEquipment: React.FC<{ selectedFleetIndex: number; data: Ship[][]; fleetName: string }> = ({
  selectedFleetIndex,
  data,
  fleetName,
}) => {
  const { shipData } = useContext(AppContext);

  return (
    <div id="equipment-section" className="f-grid gap rounded">
      <div key={`eq-fleet-${fleetName}-${selectedFleetIndex + 1}`} className="f-row gap fleet">
        {data[selectedFleetIndex].map((ship, shipIdx) => {
          return !ship ? (
            <div key={`none-${shipIdx + 1}`} className="f-column">
              <div>N/A</div>
              <div>N/A</div>
              <div>N/A</div>
            </div>
          ) : (
            parseFits(ship.slots, shipData, true, ship.retrofit).map((slot) => {
              return (
                <div key={ship.names.en} className="f-column" style={{ gap: '2px 0px', minWidth: '0' }}>
                  {Object.keys(slot).map((key, keyIdx) => (
                    <EqDropDown
                      key={`${ship.names.en}-slot-${keyIdx + 1}`}
                      text={`${key} - ${slot[key].length}`}
                      listData={slot[key]}
                    />
                  ))}
                </div>
              );
            })
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(FormationEquipment);
