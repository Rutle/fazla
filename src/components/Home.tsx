import React from 'react';
import PageTemplate from './PageTemplate';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

const Home = (): JSX.Element => {
  const appState = useSelector((state: RootState) => state.appState);
  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <div className="home-container dark">
          <div>
            <h1>Home</h1>
          </div>

          <div>
            <button className="btn dark">Update</button>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
};

export default Home;
