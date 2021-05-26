import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/types';
import { useDragAndDrop } from './DragAndDrop/useDragAndDrop';
import FormationGridItem from './FormationGridItem';

interface FormationGridProps {
  themeColor: string;
  selectedFleetIndex: number;
  ships: Ship[][];
  openSearchSection: (isOpen: boolean, gridIndex: number) => void;
  selectedGridIndex: number;
}
/*
  Formations 2:
  Main:     0-2 | 6-8   |
  Vanguard: 3-5 | 9-11  |

  Formations 4:
  Main:     0-2 | 6-8   | 12-14 | 18-20
  Vanguard: 3-5 | 9-11  | 15-17 | 21-23

*/
const isValidDropZone = (startKey: string, overKey: string): boolean => {
  const sKey = Number.parseInt(startKey, 10);
  const oKey = Number.parseInt(overKey, 10);
  const main = [0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 19, 20];
  const vanguard = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23];
  if (Number.isNaN(startKey) || Number.isNaN(overKey)) return false;
  if (main.includes(sKey) && main.includes(oKey)) return true;
  if (vanguard.includes(sKey) && vanguard.includes(oKey)) return true;
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
}) => {
  const { dragFunctions, dragStates, dataTransferArray, startKey } = useDragAndDrop({
    dataKey: 'grid-index',
    isValidDropZone,
  });
  const dispatch = useDispatch();
  const open = useCallback(
    (gridIndex: number) => () => {
      openSearchSection(true, gridIndex);
    },
    [openSearchSection]
  );

  useEffect(() => {
    // Started drag
    /*
    if (dragStates.isDragged && !dragStates.isTransferOk) {
      console.log('startkey', startKey);
    }
    */
    // Finished drag and drop.
    if (!dragStates.isDragged && dragStates.isTransferOk) {
      dispatch(formationAction(FormationAction.Switch, { switchData: dataTransferArray }));
    }
  }, [dataTransferArray, dispatch, dragStates, startKey]);

  return (
    <div id="formation-grid" className={`f-grid ${themeColor}`}>
      <div className="f-row wrap">
        <div id="main-section" className="f-column">
          <div className="f-title">Main</div>
          {ships.map((fleet, fleetIdx) => (
            <div
              key={`main-${fleetIdx * fleet.length}`}
              className={`f-row ${selectedFleetIndex === fleetIdx ? '' : 'small-hidden'}`}
              // style={{ backgroundColor: 'var(--main-dark-bg)' }}
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
          {ships.map((fleet, fleetIdx) => (
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
    </div>
  );
};

export default FormationGrid;
