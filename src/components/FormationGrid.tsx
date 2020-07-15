import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import FormationGridItem from './FormationGridItem';

const FormationGrid: React.FC = () => {
  const currentFormation = useSelector((state: RootState) => state.formationGrid);

  useEffect(() => {
    console.log(currentFormation);
  }, []);
  return (
    <div className={'f-grid'}>
      <div className={'f-row wrap'}>
        <div className={'f-column full'}>
          <div className={'f-title'}>Main</div>
          <FormationGridItem index={0} />
          <FormationGridItem index={1} />
          <FormationGridItem index={2} />
        </div>
        <div className={'f-column full'}>
          <div className={'f-title'}>Vanguard</div>
          <FormationGridItem index={3} />
          <FormationGridItem index={4} />
          <FormationGridItem index={5} />
        </div>
      </div>
    </div>
  );
};

export default FormationGrid;
