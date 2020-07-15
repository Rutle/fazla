import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PassivesList from './PassivesList';

interface ShipDetails {
  orient?: string;
  page?: string;
}

// eslint-disable-next-line react/prop-types
const ShipDetails: React.FC<ShipDetails> = ({ orient = 'vertical', page }) => {
  const shipDetails = useSelector((state: RootState) => state.shipDetails);

  return (
    <div>
      <h1>
        {shipDetails.names.code} <span className={shipDetails.rarity}>{` ${shipDetails.stars?.stars}`}</span>
      </h1>
      <PassivesList orient={orient} page={page} />
    </div>
  );
};

export default ShipDetails;
