import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  formationAction,
  FormationAction,
  MAININDEX,
  SUBMARINE,
  VANGUARDINDEX,
} from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/types';
import { useDragAndDrop } from './DragAndDrop/useDragAndDrop';
import FormationGridItem from './FormationGridItem';

interface FormationGridProps {
  themeColor: string;
  selectedFleetIndex: number;
  ships: Ship[][];
  openSearchSection: (isOpen: boolean, gridIndex: number) => void;
  selectedGridIndex: number;
  fleetCount: number;
  isSubFleet: boolean;
}

/**
 * Function to check if drop zone is valid.
 * @param fleetCount Number of fleets
 * @param main Object containing list of main fleet indexes based on fleetcount.
 * @param vanguard Object containing list of vanguard fleet indexes based on fleetcount.
 * @returns true if valid, false otherwise.
 */
const isValidDropZone =
  (
    fleetCount: number,
    main: { [key: number]: number[] },
    vanguard: { [key: number]: number[] },
    submarine: { [key: number]: number[] }
  ) =>
  (startKey: string, overKey: string): boolean => {
    const sKey = Number.parseInt(startKey, 10);
    const oKey = Number.parseInt(overKey, 10);
    if (Number.isNaN(startKey) || Number.isNaN(overKey)) return false;
    if (main[fleetCount].includes(sKey) && main[fleetCount].includes(oKey)) return true;
    if (vanguard[fleetCount].includes(sKey) && vanguard[fleetCount].includes(oKey)) return true;
    if (submarine[fleetCount].includes(sKey) && submarine[fleetCount].includes(oKey)) return true;
    return false;
  };

/**
 * Component presenting ships in a grid.
 */
const FormationGrid: React.FC<FormationGridProps> = ({
  themeColor,
  selectedFleetIndex,
  ships,
  openSearchSection,
  selectedGridIndex,
  fleetCount,
  isSubFleet,
}) => {
  const { dragFunctions, dragStates, dataTransferArray, startKey } = useDragAndDrop({
    dataKey: 'grid-index',
    isValidDropZone: isValidDropZone(fleetCount, MAININDEX, VANGUARDINDEX, SUBMARINE),
  });
  const dispatch = useDispatch();
  const open = useCallback(
    (gridIndex: number) => () => {
      openSearchSection(true, gridIndex);
    },
    [openSearchSection]
  );

  useEffect(() => {
    // Finished drag and drop.
    if (!dragStates.isDragged && dragStates.isTransferOk) {
      dispatch(formationAction(FormationAction.Switch, { switchData: dataTransferArray }));
    }
  }, [dataTransferArray, dispatch, dragStates, startKey]);

  return (
    <div id="formation-grid" className={`f-grid ${themeColor}`}>
      <div className={`f-row wrap ${isSubFleet && selectedFleetIndex === fleetCount ? 'small-hidden' : ''}`}>
        <div id="main-section" className="f-column">
          <div className="f-title">Main</div>
          {ships.slice(0, fleetCount).map((fleet, fleetIdx) => (
            <div
              key={`main-${fleetIdx * fleet.length}`}
              className={`f-row ${selectedFleetIndex === fleetIdx ? '' : 'small-hidden'}`}
            >
              {fleet.slice(0, 3).map((ship, shipIdx) => (
                <FormationGridItem
                  key={`main-${fleetIdx * 6 + shipIdx}`}
                  index={fleetIdx * 6 + shipIdx}
                  ship={ship}
                  themeColor={themeColor}
                  onClick={open(fleetIdx * 6 + shipIdx)}
                  isSelected={selectedGridIndex === fleetIdx * 6 + shipIdx}
                  dragFunctions={dragFunctions}
                />
              ))}
            </div>
          ))}
        </div>
        <div id="vanguard-section" className="f-column">
          <div className="f-title">Vanguard</div>
          {ships.slice(0, fleetCount).map((fleet, fleetIdx) => (
            <div
              key={`vanguard-${fleetIdx * fleet.length}`}
              className={`f-row ${selectedFleetIndex === fleetIdx ? '' : 'small-hidden'}`}
            >
              {fleet.slice(3).map((ship, shipIdx) => (
                <FormationGridItem
                  key={`van-${fleetIdx * 6 + (shipIdx + 3)}`}
                  index={fleetIdx * 6 + (shipIdx + 3)}
                  ship={ship}
                  themeColor={themeColor}
                  onClick={open(fleetIdx * 6 + (shipIdx + 3))}
                  isSelected={selectedGridIndex === fleetIdx * 6 + (shipIdx + 3)}
                  dragFunctions={dragFunctions}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="f-row wrap">
        {isSubFleet ? (
          <div id="submarine-section" className={`f-column ${selectedFleetIndex === fleetCount ? '' : 'small-hidden'}`}>
            <div className="f-title">Submarines</div>
            {ships.slice(-1).map((fleet) => (
              <div key={`submarine-${fleetCount * fleet.length}`} className="f-row">
                {fleet.map((ship, shipIdx) => (
                  <FormationGridItem
                    key={`sub-${fleetCount * 6 + shipIdx}`}
                    index={fleetCount * 6 + shipIdx}
                    ship={ship}
                    themeColor={themeColor}
                    onClick={open(fleetCount * 6 + shipIdx)}
                    isSelected={selectedGridIndex === fleetCount * 6 + shipIdx}
                    dragFunctions={dragFunctions}
                    isSub
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default FormationGrid;
