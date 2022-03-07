import React, { useCallback, useEffect, useRef } from 'react';
import { Ship } from '_/types/shipTypes';
import FormationGridItem from './FormationGridItem';

interface FormationGridProps {
  themeColor: string;
  selectedFleetIndex: number;
  ships: Ship[][];
  openSearchSection?: (isOpen: boolean, gridIndex: number) => void;
  selectedGridIndex?: number;
  fleetCount: number;
  isSubFleet: boolean;
  refd: React.RefObject<HTMLDivElement>;
  isExportedLink?: boolean;
}

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
  isExportedLink = false,
}) => {
  // const dispatch = useDispatch();
  const vanRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const open = useCallback(
    (gridIndex: number) => () => {
      if (openSearchSection) openSearchSection(true, gridIndex);
    },
    [openSearchSection]
  );
  useEffect(() => {
    console.log(selectedFleetIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFleetIndex]);
  return (
    <div id="formation-grid" className={`f-grid rounded gap ${themeColor}`} ref={refd}>
      <div className={`f-row gap wrap ${isSubFleet && selectedFleetIndex === fleetCount ? 'hidden' : ''}`}>
        <div id="main-section" className="f-column" ref={mainRef}>
          {/* 
          <div className="f-row">
            <div className="f-header">Main</div>
          </div>
          */}
          {ships.slice(0, fleetCount).map((fleet, fleetIdx) => (
            <div
              key={`main-${fleetIdx * fleet.length}`}
              className={`f-row fleet${selectedFleetIndex === fleetIdx ? '' : ' hidden'}`}

            >
              {fleet.slice(0, 3).map((ship, shipIdx) => (
                <FormationGridItem
                  key={`main-${fleetIdx * 6 + shipIdx}`}
                  index={fleetIdx * 6 + shipIdx}
                  ship={ship}
                  themeColor={themeColor}
                  onClick={open(fleetIdx * 6 + shipIdx)}
                  isSelected={selectedGridIndex === fleetIdx * 6 + shipIdx}
                  // dragFunctions={dragFunctions}
                  fleetCount={fleetCount}
                  isInteractive={!isExportedLink}
                />
              ))}
            </div>
          ))}
        </div>
        <div id="vanguard-section" className="f-column" ref={vanRef}>
          {ships.slice(0, fleetCount).map((fleet, fleetIdx) => (
            <div
              key={`vanguard-${fleetIdx * fleet.length}`}
              className={`f-row fleet${selectedFleetIndex === fleetIdx ? '' : ' hidden'}`}
            >
              {fleet.slice(3).map((ship, shipIdx) => (
                <FormationGridItem
                  key={`van-${fleetIdx * 6 + (shipIdx + 3)}`}
                  index={fleetIdx * 6 + (shipIdx + 3)}
                  ship={ship}
                  themeColor={themeColor}
                  onClick={open(fleetIdx * 6 + (shipIdx + 3))}
                  isSelected={selectedGridIndex === fleetIdx * 6 + (shipIdx + 3)}
                  // dragFunctions={dragFunctions}
                  fleetCount={fleetCount}
                  isInteractive={!isExportedLink}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="f-row gap wrap">
        {isSubFleet ? (
          <div
            id="submarine-section"
            className={`f-column${selectedFleetIndex === fleetCount ? '' : ' hidden'}`}
            ref={subRef}
            style={{ marginBottom: '10px' }}
          >
            {ships.slice(-1).map((fleet) => (
              <div key="submarine" className="f-row fleet">
                {fleet.map((ship, shipIdx) => (
                  <FormationGridItem
                    key={`sub-${fleetCount * 6 + shipIdx}`}
                    index={fleetCount * 6 + shipIdx}
                    ship={ship}
                    themeColor={themeColor}
                    onClick={open(fleetCount * 6 + shipIdx)}
                    isSelected={selectedGridIndex === fleetCount * 6 + shipIdx}
                    // dragFunctions={dragFunctions}
                    isSub
                    fleetCount={fleetCount}
                    isInteractive={!isExportedLink}
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
