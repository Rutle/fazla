import React from 'react';
import PageTemplate from './PageTemplate';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

const DocksView: React.FC = () => {
  const config = useSelector((state: RootState) => state.config);
  return (
    <PageTemplate>
      <section className="home">
        <h1>Home</h1>
      </section>
    </PageTemplate>
  );
};

export default DocksView;
