import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import FormationGridItem from './FormationGridItem';

const FormationGrid: React.FC = () => {
  const currentFormation = useSelector((state: RootState) => state.formationGrid);

  return (
    <div className={'f-grid rounded'}>
      <div className={'f-row'}>
        <FormationGridItem index={0} />
        <FormationGridItem index={1} />
        <FormationGridItem index={2} />
      </div>
      <div className={'f-row'}>
        <FormationGridItem index={3} />
        <FormationGridItem index={4} />
        <FormationGridItem index={5} />
      </div>
    </div>
  );
};

export default FormationGrid;
