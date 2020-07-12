import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PageTemplate from './PageTemplate';
import ShipList from './ShipList';
import ShipDetails from './ShipDetails';
import PassivesList from './PassivesList';

const FormationView: React.FC = () => {
  const [listToggle, setListToggle] = useState('all');

  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <ShipList listToggle={listToggle} setListToggle={setListToggle} />
        <div id="ship-data">
          <PassivesList orient={'horizontal'} page={'formation'} />
          {/* <FormationGrid />*/}
          {/* <FormationPassives /> */}
        </div>
      </section>
    </PageTemplate>
  );
};

export default FormationView;
