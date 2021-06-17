import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fleets } from '_/data/categories';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/shipTypes';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import FormationGridItem from './FormationGridItem';

interface FormationGridProps {
  themeColor: string;
  selectedFleetIndex: number;
  ships: Ship[][];
  openSearchSection: (isOpen: boolean, gridIndex: number) => void;
  selectedGridIndex: number;
  fleetCount: number;
  isSubFleet: boolean;
  refd: React.RefObject<HTMLDivElement>;
}

/**
 * Function to check if drop zone is valid.
 * @param fleetCount Number of fleets
 * @param main Object containing list of main fleet indexes based on fleetcount.
 * @param vanguard Object containing list of vanguard fleet indexes based on fleetcount.
 * @returns true if valid, false otherwise.
 */
const isValidDropZone =
  (fleetHulls: { MAIN: string[]; VANGUARD: string[]; SUBS: string[] }) =>
  (startKey: string, overKey: string): boolean => {
    if (startKey === 'none' || overKey === 'none') return false;
    if (
      (fleetHulls.MAIN.includes(startKey) && fleetHulls.MAIN.includes(overKey)) ||
      (fleetHulls.MAIN.includes(startKey) && overKey === 'main')
    )
      return true;
    if (
      (fleetHulls.VANGUARD.includes(startKey) && fleetHulls.VANGUARD.includes(overKey)) ||
      (fleetHulls.VANGUARD.includes(startKey) && overKey === 'vanguard')
    )
      return true;
    if (
      (fleetHulls.SUBS.includes(startKey) && fleetHulls.SUBS.includes(overKey)) ||
      (fleetHulls.SUBS.includes(startKey) && overKey === 'submarine')
    )
      return true;
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
  refd,
}) => {
  const { dragFunctions, dragStates, transferData } = useDragAndDrop({
    dataKeys: ['grid-index', 'transfer-type', 'ship-id'],
    baseKey: 'hull',
    isValidDropZone: isValidDropZone(fleets),
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
      const { start, end } = transferData;
      if (start['transfer-type'] === 'switch') {
        // Drag within formation
        dispatch(
          formationAction(FormationAction.Switch, {
            switchData: [start['grid-index'], end['grid-index']],
          })
        );
      } else if (start['transfer-type'] === 'insert') {
        // Drag from ship list to formation.
        const gridIndex = Number.parseInt(end['grid-index'], 10);
        const shipID = start['ship-id'];
        dispatch(formationAction(FormationAction.Insert, { insertData: { gridIndex, shipID } }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferData, dispatch, dragStates]);

  return (
    <div id="formation-grid" className={`f-grid ${themeColor}`} ref={refd}>
      <div className={`f-row wrap ${isSubFleet && selectedFleetIndex === fleetCount ? 'small-hidden' : ''}`}>
        <div id="main-section" className="f-column">
          <div className="f-title">Main</div>
          {ships.slice(0, fleetCount).map((fleet, fleetIdx) => (
            <div
              key={`main-${fleetIdx * fleet.length}`}
              className={`f-row ${selectedFleetIndex === fleetIdx ? '' : 'small-hidden'}`}
              style={{ marginBottom: '2px' }}
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
                  fleetCount={fleetCount}
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
              style={{ marginBottom: '2px' }}
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
                  fleetCount={fleetCount}
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
                    fleetCount={fleetCount}
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
