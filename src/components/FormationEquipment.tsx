import React, { useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '_/App';
import { RootState } from '_/reducers/rootReducer';
import { Ship } from '_/types/shipTypes';
import { parseFits } from '_/utils/appUtilities';
import DropDownButton from './DropDown/CustomDropDown';

const EqDropDown: React.FC<{
  text: string;
  listData: string[];
  listLimit?: number;
  size?: 'normal' | 'small';
}> = ({ text, listData, listLimit = 10, size = 'small' }) => {
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const config = useSelector((state: RootState) => state.config);
  return (
    <DropDownButton
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
      drop="down"
      alignEnd
      selectedIdx={selectedIndex}
      listData={listData}
      selectIndex={setSelectedIndex}
      onSelect={setShow}
      options={{
        listLimit,
        themeColor: config.themeColor,
        toggleSize: size,
        dropdownClass: 'equipment',
        toggleText: typeof selectedIndex !== 'undefined' ? listData[selectedIndex] : text,
      }}
      // Text need to be either Empty (none in formation data) or Name of equipment from formation data.
    />
  );
};

const FormationEquipment: React.FC<{ selectedFleetIndex: number; data: Ship[][] }> = ({ selectedFleetIndex, data }) => {
  const config = useSelector((state: RootState) => state.config);
  const { shipData } = useContext(AppContext);
  const ddRef = useRef<HTMLDivElement>(null);
  return (
    <div id="equipment-grid" className={`f-grid rounded gap ${config.themeColor}`}>
      <div className="f-row gap wrap">
        <div className="f-column">
          <div className="f-row fleet gap">
            {data[selectedFleetIndex].slice(0, 3).map((ship, shipIdx) => {
              // slice (0, 3) and (3) -> main and vanguard each has their own f-row container for easy
              // column change in smaller screen
              return !ship ? (
                <div key={`none-${shipIdx + 1}`} className="f-column" style={{ gap: '2px 0px', minWidth: '0' }}>
                  <div style={{ flex: 1 }}>N/A</div>
                  <div style={{ flex: 1 }}>N/A</div>
                  <div style={{ flex: 1 }}>N/A</div>
                </div>
              ) : (
                parseFits(ship.slots, shipData, true, ship.retrofit).map((slot) => {
                  return (
                    <div ref={ddRef} key={ship.names.en} className="f-column" style={{ gap: '2px 0px', minWidth: '0' }}>
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
        <div className="f-column">
          <div className="f-row fleet gap">
            {data[selectedFleetIndex].slice(3).map((ship, shipIdx) => {
              // slice (0, 3) and (3) -> main and vanguard each has their own f-row container for easy
              // column change in smaller screen
              return !ship ? (
                <div key={`none-${shipIdx + 1}`} className="f-column" style={{ gap: '2px 0px', minWidth: '0' }}>
                  <div style={{ flex: 1, padding: '0px 5px', fontVariantCaps: 'all-petite-caps' }}>N/A</div>
                  <div style={{ flex: 1, padding: '0px 5px', fontVariantCaps: 'all-petite-caps' }}>N/A</div>
                  <div style={{ flex: 1, padding: '0px 5px', fontVariantCaps: 'all-petite-caps' }}>N/A</div>
                </div>
              ) : (
                parseFits(ship.slots, shipData, true, ship.retrofit).map((slot) => {
                  return (
                    <div ref={ddRef} key={ship.names.en} className="f-column" style={{ gap: '2px 0px', minWidth: '0' }}>
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
      </div>
    </div>
  );
};

export default React.memo(FormationEquipment);
