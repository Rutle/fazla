import React from 'react';
import FormationGridItem from './FormationGridItem';

// eslint-disable-next-line react/prop-types
const FormationGrid: React.FC = () => {
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