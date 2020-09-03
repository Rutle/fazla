/* eslint-disable react/prop-types */
import React from 'react';
import FormationGridItem from './FormationGridItem';
import DataStore from '../util/dataStore';
import PropTypes from 'prop-types';
import { Formation } from '../reducers/slices/formationGridSlice';
interface FormationGridProps {
  shipData: DataStore;
  formation: Formation;
  themeColor: string;
}

const FormationGrid: React.FC<FormationGridProps> = ({ shipData, formation, themeColor }) => {
  return (
    <>
      <div className={`f-grid ${themeColor}`}>
        <div className="f-row wrap">
          <div className="f-column">
            <div className="f-row">
              <div className="f-title">Main</div>
            </div>
            <div className="f-row">
              <FormationGridItem index={0} ship={shipData.getShipById(formation.data[0])} />
              <FormationGridItem index={1} ship={shipData.getShipById(formation.data[1])} />
              <FormationGridItem index={2} ship={shipData.getShipById(formation.data[2])} />
            </div>
          </div>
          <div className="f-column">
            <div className="f-row">
              <div className="f-title">Vanguard</div>
            </div>
            <div className="f-row">
              <FormationGridItem index={3} ship={shipData.getShipById(formation.data[3])} />
              <FormationGridItem index={4} ship={shipData.getShipById(formation.data[4])} />
              <FormationGridItem index={5} ship={shipData.getShipById(formation.data[5])} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormationGrid;

FormationGrid.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
