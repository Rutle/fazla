import React from 'react';
import FormationGridItem from './FormationGridItem';
import DataStore from '../util/dataStore';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PropTypes from 'prop-types';
interface FormationGridProps {
  shipData: DataStore;
}

const FormationGrid: React.FC<FormationGridProps> = ({ shipData }) => {
  const currentFormation = useSelector((state: RootState) => state.formationGrid);
  return (
    <>
      <div className="f-grid">
        <div className="f-row wrap">
          <div className="f-column">
            <div className={'f-title'}>Main</div>
            <div className="f-row">
              <FormationGridItem index={0} ship={shipData.getShipById(currentFormation[0])} />
              <FormationGridItem index={1} ship={shipData.getShipById(currentFormation[1])} />
              <FormationGridItem index={2} ship={shipData.getShipById(currentFormation[2])} />
            </div>
          </div>
          <div className="f-column">
            <div className={'f-title'}>Vanguard</div>
            <div className="f-row">
              <FormationGridItem index={3} ship={shipData.getShipById(currentFormation[3])} />
              <FormationGridItem index={4} ship={shipData.getShipById(currentFormation[4])} />
              <FormationGridItem index={5} ship={shipData.getShipById(currentFormation[5])} />
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
