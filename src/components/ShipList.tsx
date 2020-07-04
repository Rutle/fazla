import React, { useEffect } from 'react';
import PageTemplate from './PageTemplate';
import { getShips } from './util/shipdata';

const ShipList = (): JSX.Element => {
  useEffect(() => {
    console.log(getShips('Z23'));
  }, []);
  return (
    <PageTemplate>
      <section className="ship-list">
        <h1>List</h1>
      </section>
    </PageTemplate>
  );
};

export default ShipList;
