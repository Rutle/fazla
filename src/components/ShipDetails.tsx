import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PassivesList from './PassivesList';
import { openUrl } from '../util/appUtilities';

interface ShipDetails {
  orient?: string;
  page?: string;
}

// eslint-disable-next-line react/prop-types
const ShipDetails: React.FC<ShipDetails> = ({ orient = 'vertical', page }) => {
  const listState = useSelector((state: RootState) => state.listState);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);

  useEffect(() => {
    console.log('ship details: [', listState.cState, ']');
  }, []);

  const openWikiUrl = () => {
    console.log(urlValidation());
    openUrl(shipDetails.wikiUrl as string);
  };

  const urlValidation = (): boolean => {
    if (shipDetails.wikiUrl === undefined) return false;
    const urlVal = 'https?://(www.)?azurlane.koumakan.jp.*';
    const flags = 'gi';
    const re = new RegExp(urlVal, flags);
    return re.test(shipDetails.wikiUrl as string);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <h1>
          {shipDetails.names.en} <span className={shipDetails.rarity}>{` ${shipDetails.stars?.stars}`}</span>
        </h1>
        <span style={{ display: 'flex', alignItems: 'center', paddingRight: '15px' }}>
          <button
            className="btn dark"
            style={{ width: '50px', height: '25px' }}
            onClick={() => openWikiUrl()}
            disabled={!urlValidation()}
          >
            <b>wiki</b>
          </button>
        </span>
      </div>
      <PassivesList orient={orient} /* page={page} */ />
    </>
  );
};

export default ShipDetails;
