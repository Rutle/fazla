import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setList } from '../reducers/slices/shipListSlice';
import PageTemplate from './PageTemplate';
import { getShips, ShipData } from './util/shipdata';

const ShipList: React.FC = () => {
  const dispatch = useDispatch();
  const shipList = useSelector((state: RootState) => state.shipList);

  useEffect(() => {
    console.log('useEffect', getShips('Z23'));
    try {
      const data: ShipData = getShips('Z23');
      console.log('shipData', data);
      dispatch(setList(data));
    } catch (e) {
      console.log(e);
    }
    console.log('end of useEffect', shipList);
  }, []);

  useEffect(() => {
    console.log('useEffect Shiplist', shipList);
  }, [shipList]);
  /*
  const renderList: JSX.Element = () => {
    if (shipList.ships.length < 1)


  }
  */

  const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    console.log(event);
  };

  return (
    <PageTemplate>
      <section className="ship-list">
        <h1>Ships</h1>
        <div id="ship-content">
          <div id="shiplist">
            <ul>
              <li onClick={(e) => handleClick(e)}>Coffee</li>
              <li>Tea</li>
              <li>Milk</li>
            </ul>
          </div>
          <div id="ship-data">ship data</div>
        </div>
      </section>
    </PageTemplate>
  );
};

export default ShipList;
