/* eslint-disable react/prop-types */
import React from 'react';
import FormationGridItem from './FormationGridItem';
import { Formation, Ship } from '../util/types';
interface FormationGridProps {
  formation: Formation;
  themeColor: string;
  formationShips: { [key: string]: Ship };
}

const FormationGrid: React.FC<FormationGridProps> = ({ formation, themeColor, formationShips }) => {
  return (
    <>
      <div className={`f-grid ${themeColor}`}>
        <div className="f-row wrap">
          <div className="f-column">
            <div className="f-row">
              <div className="f-title">Main</div>
            </div>
            <div className="f-row">
              <FormationGridItem index={0} ship={formationShips[formation.data[0]]} themeColor={themeColor} />
              <FormationGridItem index={1} ship={formationShips[formation.data[1]]} themeColor={themeColor} />
              <FormationGridItem index={2} ship={formationShips[formation.data[2]]} themeColor={themeColor} />
            </div>
          </div>
          <div className="f-column">
            <div className="f-row">
              <div className="f-title">Vanguard</div>
            </div>
            <div className="f-row">
              <FormationGridItem index={3} ship={formationShips[formation.data[3]]} themeColor={themeColor} />
              <FormationGridItem index={4} ship={formationShips[formation.data[4]]} themeColor={themeColor} />
              <FormationGridItem index={5} ship={formationShips[formation.data[5]]} themeColor={themeColor} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormationGrid;
