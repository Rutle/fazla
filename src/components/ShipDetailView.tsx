import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setList } from '../reducers/slices/shipListSlice';
import PageTemplate from './PageTemplate';
import { getShips, ShipData, Ship, getShipById } from './util/shipdata';
import ShipDetails from './ShipDetails';
import { setDetails } from '../reducers/slices/shipDetailsSlice';

const ShipDetailView: React.FC = () => {
  const dispatch = useDispatch();
  const shipList = useSelector((state: RootState) => state.shipList);

  const [selectedId, setSelected] = useState('');

  useEffect(() => {
    console.log('useEffect', getShips('KMS'));
    try {
      const data: ShipData = getShips('KMS');
      console.log('shipData', data);
      dispatch(setList(data));
    } catch (e) {
      console.log(e);
    }
    console.log('end of useEffect', shipList);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    try {
      dispatch(setDetails(getShipById(id)));
      setSelected(id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <div id="ship-side-list">
          <div className="rList">
            {shipList.ships.map((ship: Ship) => {
              /*
              return (
                <li key={ship.id} className="rList-item" onClick={(e) => handleClick(e, ship.id)}>
                  {ship.names.code}
                </li>
              );
              */
              return (
                <button
                  key={ship.id}
                  // className="rList-item btn-rList"
                  className={`rList-item btn-rList ${ship.id === selectedId ? 'btn-selected' : ''}`}
                  type="button"
                  onClick={(e) => handleClick(e, ship.id)}
                >
                  {ship.names.code}
                </button>
              );
            })}
          </div>
        </div>
        <div id="ship-data">
          <ShipDetails />
        </div>
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
