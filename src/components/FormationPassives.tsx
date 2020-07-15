import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
// import { getShipById, Ship } from './util/shipdata';
import FormationShipPassives from './FormationShipPassives';

const FormationPassives: React.FC = () => {
  // const dispatch = useDispatch();
  const currentFormation = useSelector((state: RootState) => state.formationGrid);
  // const listState = useSelector((state: RootState) => state.listState);
  // const shipList = useSelector((state: RootState) => state.shipList);
  // const config = useSelector((state: RootState) => state.config);

  return (
    <div className={'f-grid'}>
      <div className={'f-row'}>
        <div className={'f-column'}>
          <div className={'f-title'}>Main</div>
          <div className={'f-row'}>
            <div className={'grid-item name-title'}>Ship</div>
            <div className={'grid-item passive-title'}>Passive</div>
          </div>
          <FormationShipPassives ship={currentFormation[0]} />
          <FormationShipPassives ship={currentFormation[1]} />
          <FormationShipPassives ship={currentFormation[2]} />
        </div>
      </div>
      <div className={'f-row'}>
        <div className={'f-column'}>
          <div className={'f-title'}>Vanguard</div>
          <div className={'f-row'}>
            <div className={'grid-item name-title'}>Name</div>
            <div className={'grid-item passive-title'}>Passive</div>
          </div>
          <FormationShipPassives ship={currentFormation[3]} />
          <FormationShipPassives ship={currentFormation[4]} />
          <FormationShipPassives ship={currentFormation[5]} />
        </div>
      </div>
    </div>
  );
};

export default FormationPassives;
