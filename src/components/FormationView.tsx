import React from 'react';
import PageTemplate from './PageTemplate';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

const FormationView: React.FC = () => {
  const config = useSelector((state: RootState) => state.config);
  return (
    <PageTemplate>
      <section className="home">
        <h1>Formation</h1>
      </section>
    </PageTemplate>
  );
};

export default FormationView;
