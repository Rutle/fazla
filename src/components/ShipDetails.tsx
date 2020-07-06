import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { Ship } from './util/shipdata';

const ShipDetails: React.FC = () => {
  const dispatch = useDispatch();
  const shipDetails = useSelector((state: RootState) => state.shipDetails);

  useEffect(() => {
    // console.log('details', shipDetails);
  }, [shipDetails]);
  return (
    <>
      <div>
        <h1>{shipDetails.names.code}</h1>
      </div>
    </>
  );
};

export default ShipDetails;
