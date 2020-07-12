import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

const FormationGrid: React.FC = () => {
  const currentFormation = useSelector((state: RootState) => state.formationGrid);

  return (
    <div className={'f-grid rounded'}>
      <div className={'f-row'}>
        <div className={'dark'}>{currentFormation[0].name}</div>
        <div className={'dark'}>{currentFormation[1].name}</div>
        <div className={'dark'}>{currentFormation[2].name}</div>
      </div>
      <div className={'f-row'}>
        <div className={'dark'}>{currentFormation[3].name}</div>
        <div className={'dark'}>{currentFormation[4].name}</div>
        <div className={'dark'}>{currentFormation[5].name}</div>
      </div>
    </div>
  );
};

export default FormationGrid;
