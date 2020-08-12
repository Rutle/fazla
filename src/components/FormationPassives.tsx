import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import FormationShipPassives from './FormationShipPassives';
import DataStore from '../util/dataStore';
import PropTypes from 'prop-types';
interface FormationPassives {
  shipData: DataStore;
}
const FormationPassives: React.FC<FormationPassives> = ({ shipData }) => {
  const currentFormation = useSelector((state: RootState) => state.formationGrid);

  return (
    <div className={'f-grid'}>
      <div className={'f-row'}>
        <div className={'f-column'}>
          <div className={'f-title'}>Main</div>
          <div className={'f-row'}>
            <div className={'grid-item name-title'}>Ship</div>
            <div className={'grid-item passive-title'}>Passive</div>
          </div>
          <FormationShipPassives ship={shipData.getShipById(currentFormation[0])} />
          <FormationShipPassives ship={shipData.getShipById(currentFormation[1])} />
          <FormationShipPassives ship={shipData.getShipById(currentFormation[2])} />
        </div>
      </div>
      <div className={'f-row'}>
        <div className={'f-column'}>
          <div className={'f-title'}>Vanguard</div>
          <div className={'f-row'}>
            <div className={'grid-item name-title'}>Name</div>
            <div className={'grid-item passive-title'}>Passive</div>
          </div>
          <FormationShipPassives ship={shipData.getShipById(currentFormation[3])} />
          <FormationShipPassives ship={shipData.getShipById(currentFormation[4])} />
          <FormationShipPassives ship={shipData.getShipById(currentFormation[5])} />
        </div>
      </div>
    </div>
  );
};

export default FormationPassives;

FormationPassives.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
