import React, { useCallback } from 'react';
import { Ship } from '_/types/types';
import FormationGridItem from './FormationGridItem';

interface FormationGridProps {
  themeColor: string;
  selectedIndex: number;
  ships: Ship[][];
  openSearchSection: (isOpen: boolean, gridIndex: number) => void;
}

/**
 * Component presenting ships in a grid.
 */
const FormationGrid: React.FC<FormationGridProps> = ({ themeColor, selectedIndex, ships, openSearchSection }) => {
  const open = useCallback(
    (gridIndex: number) => () => {
      openSearchSection(true, gridIndex);
    },
    [openSearchSection]
  );
  return (
    <div className={`f-grid ${themeColor}`}>
      <div className="f-row wrap">
        <div id="main-section" className="f-column">
          <div className="f-title">Main</div>
          {ships.map((fleet, idx) => (
            <div key={`main-${idx * fleet.length}`} className={`f-row ${selectedIndex === idx ? '' : 'small-hidden'}`}>
              {fleet.slice(0, 3).map((ship, idxx) => (
                <FormationGridItem
                  key={`main-${idx * 6 + idxx}`}
                  index={idx * 6 + idxx}
                  ship={ship}
                  themeColor={themeColor}
                  onClick={open(idx * 6 + idxx)}
                />
              ))}
            </div>
          ))}
        </div>
        <div id="vanguard-section" className="f-column">
          <div className="f-title">Vanguard</div>
          {ships.map((fleet, idx) => (
            <div
              key={`vanguard-${idx * fleet.length}`}
              className={`f-row ${selectedIndex === idx ? '' : 'small-hidden'}`}
            >
              {fleet.slice(3).map((ship, idxx) => (
                <FormationGridItem
                  key={`van-${idx * 6 + (idxx + 3)}`}
                  index={idx * 6 + (idxx + 3)}
                  ship={ship}
                  themeColor={themeColor}
                  onClick={open(idx * 6 + (idxx + 3))}
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
