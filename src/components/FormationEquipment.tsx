import React, { useContext, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppContext } from '_/App';
import { RootState } from '_/reducers/rootReducer';
import { FormationAction, formationAction } from '_/reducers/slices/formationGridSlice';
import { Equipment } from '_/types/equipmentTypes';
import { Ship } from '_/types/shipTypes';
import { parseFits } from '_/utils/appUtilities';
import DropDownButton from './DropDown/CustomDropDown';

const EqDropDown: React.FC<{
  shipIdx: number;
  slotIdx: number;
  fleetIdx: number;
  formIdx: number;
  isOldFormation: boolean;
  text: string;
  listData: Equipment[];
  listLimit?: number;
  size?: 'normal' | 'small';
}> = ({ shipIdx, slotIdx, fleetIdx, formIdx, isOldFormation, text, listData, listLimit = 10, size = 'small' }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const config = useSelector((state: RootState) => state.config);
  const { shipData } = useContext(AppContext);

  const selectIndex = (eqIdx: number) => {
    dispatch(
      formationAction(FormationAction.AddEq, {
        eqData: {
          formIdx,
          fleetIdx,
          shipIdx,
          slotIdx,
          isOldFormation,
          eqId: shipData.getEqCustomId(listData[eqIdx].id),
        },
      })
    );
  };

  return (
    <DropDownButton
      show={show}
      onToggle={(nextShow) => setShow(nextShow)}
      drop="down"
      alignEnd
      selectedIdx={selectedIndex}
      listData={listData.slice().map((eq) => eq.names.en)}
      selectIndex={selectIndex}
      onSelect={setShow}
      options={{
        listLimit,
        themeColor: config.themeColor,
        toggleSize: size,
        dropdownClass: 'equipment',
        toggleText: text,
      }}
    />
  );
};

const FormationEquipment: React.FC<{
  selectedFleetIndex: number;
  data: Ship[][];
  equipmentData: string[][][];
  isOldFormation: boolean;
  isExportedLink?: boolean;
}> = ({ selectedFleetIndex, data, equipmentData, isOldFormation, isExportedLink = false }) => {
  const config = useSelector((state: RootState) => state.config);
  const fData = useSelector((state: RootState) => state.formationGrid);
  const { shipData } = useContext(AppContext);
  const ddRef = useRef<HTMLDivElement>(null);

  return (
    <div id="equipment-grid" className={`f-grid rounded gap ${config.themeColor}`}>
      <div className="f-row gap wrap">
        <div className="f-column">
          <div className="f-row fleet gap">
            {data[selectedFleetIndex].slice(0, 3).map((ship, shipIdx) => {
              if (ship && !isExportedLink) {
                return parseFits(ship.slots, shipData, true, ship.retrofit).map((shipFits) => {
                  return (
                    <div ref={ddRef} key={ship.names.en} className="f-column" style={{ gap: '2px 0px', minWidth: '0' }}>
                      {Object.keys(shipFits).map((slotName, slotIdx) => (
                        <EqDropDown
                          key={`${ship.names.en}-slot-${slotIdx + 1}`}
                          shipIdx={shipIdx + 6 * selectedFleetIndex} // Calculate the actual index of the ship
                          slotIdx={slotIdx}
                          formIdx={fData.selectedIndex}
                          fleetIdx={selectedFleetIndex}
                          isOldFormation={isOldFormation}
                          text={equipmentData[selectedFleetIndex][shipIdx][slotIdx]}
                          listData={shipFits[slotName]}
                        />
                      ))}
                    </div>
                  );
                });
              }
              return (
                <div key={`none-${shipIdx + 1}`} className="f-column" style={{ gap: '2px 0px', minWidth: '0' }}>
                  <div className="dropdown placeholder">
                    <span style={{ height: '18px' }}>
                      {!ship ? '-' : equipmentData[selectedFleetIndex][shipIdx][0]}
                    </span>
                  </div>
                  <div className="dropdown placeholder">
                    <span style={{ height: '18px' }}>
                      {!ship ? '-' : equipmentData[selectedFleetIndex][shipIdx][1]}
                    </span>
                  </div>
                  <div className="dropdown placeholder">
                    <span style={{ height: '18px' }}>
                      {!ship ? '-' : equipmentData[selectedFleetIndex][shipIdx][2]}
                    </span>
                  </div>
                </div>
              );
              // slice (0, 3) and (3) -> main and vanguard each has their own f-row container for easy
              // column change in smaller screen
            })}
          </div>
        </div>
        {data[selectedFleetIndex].length > 3 ? (
          <div className="f-column">
            <div className="f-row fleet gap">
              {data[selectedFleetIndex].slice(3).map((ship, shipIdx) => {
                // slice (0, 3) and (3) -> main and vanguard each has their own f-row container for easy
                // column change in smaller screen
                if (ship && !isExportedLink) {
                  return parseFits(ship.slots, shipData, true, ship.retrofit).map((shipFits) => {
                    return (
                      <div
                        ref={ddRef}
                        key={ship.names.en}
                        className="f-column"
                        style={{ gap: '2px 0px', minWidth: '0' }}
                      >
                        {Object.keys(shipFits).map((slotName, slotIdx) => (
                          <EqDropDown
                            key={`${ship.names.en}-slot-${slotIdx + 1}`}
                            shipIdx={shipIdx + 3 + 6 * selectedFleetIndex} // Calculate the actual index of the ship
                            slotIdx={slotIdx}
                            formIdx={fData.selectedIndex}
                            fleetIdx={selectedFleetIndex}
                            isOldFormation={isOldFormation}
                            text={equipmentData[selectedFleetIndex][shipIdx + 3][slotIdx]}
                            listData={shipFits[slotName]}
                          />
                        ))}
                      </div>
                    );
                  });
                }
                return (
                  <div key={`none-${shipIdx + 1}`} className="f-column" style={{ gap: '2px 0px', minWidth: '0' }}>
                    <div className="dropdown placeholder">
                      <span style={{ height: '18px' }}>
                        {!ship ? '-' : equipmentData[selectedFleetIndex][shipIdx + 3][0]}
                      </span>
                    </div>
                    <div className="dropdown placeholder">
                      <span style={{ height: '18px' }}>
                        {!ship ? '-' : equipmentData[selectedFleetIndex][shipIdx + 3][1]}
                      </span>
                    </div>
                    <div className="dropdown placeholder">
                      <span style={{ height: '18px' }}>
                        {!ship ? '-' : equipmentData[selectedFleetIndex][shipIdx + 3][2]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default React.memo(FormationEquipment);
