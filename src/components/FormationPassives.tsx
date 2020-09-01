/* eslint-disable react/prop-types */
import React from 'react';
import FormationShipPassives from './FormationShipPassives';
import DataStore from '../util/dataStore';
import PropTypes from 'prop-types';
import { Formation } from '../reducers/slices/formationGridSlice';
interface FormationPassivesProps {
  shipData: DataStore;
  formation: Formation;
  themeColor: string;
}
const FormationPassives: React.FC<FormationPassivesProps> = ({ shipData, formation, themeColor }) => {
  const isShip = (position: string) => {
    if (position === 'main') {
      return formation.data.slice(0, 3).every((x) => x === 'NONE');
    } else if (position === 'vanguard') {
      return formation.data.slice(3, 6).every((x) => x === 'NONE');
    } else {
      return false;
    }
  };

  return (
    <div className={'f-grid'}>
      {!isShip('main') ? (
        <div className={'f-row'}>
          <div className={'f-column'}>
            <div className={`f-title ${themeColor}`}>Main</div>
            <div className={'f-row'}>
              <div className={'grid-item name header'}>Ship</div>
              <div className={'grid-item passive header'}>Passive</div>
            </div>
            <FormationShipPassives ship={shipData.getShipById(formation.data[0])} />
            <FormationShipPassives ship={shipData.getShipById(formation.data[1])} />
            <FormationShipPassives ship={shipData.getShipById(formation.data[2])} />
          </div>
        </div>
      ) : (
        <></>
      )}
      {!isShip('vanguard') ? (
        <div className={'f-row'}>
          <div className={'f-column'}>
            <div className={`f-title ${themeColor}`}>Vanguard</div>
            <div className={'f-row'}>
              <div className={'grid-item name header'}>Name</div>
              <div className={'grid-item passive header'}>Passive</div>
            </div>
            <FormationShipPassives ship={shipData.getShipById(formation.data[3])} />
            <FormationShipPassives ship={shipData.getShipById(formation.data[4])} />
            <FormationShipPassives ship={shipData.getShipById(formation.data[5])} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FormationPassives;

FormationPassives.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
  themeColor: PropTypes.string.isRequired,
};
