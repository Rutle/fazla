import React, { useCallback, useRef } from 'react';
import { Ship } from '_/types/shipTypes';
import FormationGridItem from './FormationGridItem';

interface FormationGridProps {
  fleetName: string;
  themeColor: string;
  selectedFleetIndex: number;
  ships: Ship[][];
  openSearchSection?: (gridIndex: number) => void;
  selectedGridIndex?: number;
  fleetCount: number;
  isSubFleet: boolean;
  // refd: React.RefObject<HTMLDivElement>;
  viewOnly?: boolean;
}

/**
 * Component presenting ships in a grid.
 */
const FormationGrid: React.FC<FormationGridProps> = ({
  fleetName,
  themeColor,
  selectedFleetIndex,
  ships,
  openSearchSection,
  selectedGridIndex,
  fleetCount,
  isSubFleet,
  viewOnly = false,
}) => {
  const vanRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  const open = useCallback(
    (gridIndex: number) => () => {
      if (openSearchSection) openSearchSection(gridIndex);
    },
    [openSearchSection]
  );

  return (
    <div id="formation-grid" className={`f-grid rounded gap ${themeColor}`}>
      <div className={`f-row gap wrap ${selectedFleetIndex === fleetCount ? 'hidden' : ''}`}>
        <div id="main-section" className="f-column" ref={mainRef} style={{ width: '50%' }}>
          {ships.slice(0, fleetCount).map((fleet, fleetIdx) => (
            <div
              key={`main-${fleetIdx + 1}-${fleetName}`}
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
                  fleetCount={fleetCount}
                  isInteractive={!viewOnly}
                />
              ))}
            </div>
          ))}
        </div>
        <div id="vanguard-section" className="f-column" ref={vanRef} style={{ width: '50%' }}>
          {ships.slice(0, fleetCount).map((fleet, fleetIdx) => (
            <div
              key={`vanguard-${fleetIdx + 1}-${fleetName}`}
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
                  fleetCount={fleetCount}
                  isInteractive={!viewOnly}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="f-row gap wrap">
        <div
          id="submarine-section"
          className={`f-column${selectedFleetIndex === fleetCount ? '' : ' hidden'}`}
          ref={subRef}
          style={{ marginBottom: '10px' }}
        >
          {isSubFleet ? (
            ships.slice(-1).map((fleet) => (
              <div key="submarine" className="f-row fleet">
                {fleet.map((ship, shipIdx) => (
                  <FormationGridItem
                    key={`sub-${fleetCount * 6 + shipIdx}-${fleetName}`}
                    index={fleetCount * 6 + shipIdx}
                    ship={ship}
                    themeColor={themeColor}
                    onClick={open(fleetCount * 6 + shipIdx)}
                    isSelected={selectedGridIndex === fleetCount * 6 + shipIdx}
                    isSub
                    fleetCount={fleetCount}
                    isInteractive={!viewOnly}
                  />
                ))}
              </div>
            ))
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontVariantCaps: 'all-petite-caps',
                marginBottom: '10px',
              }}
            >
              No submarines
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(FormationGrid);
