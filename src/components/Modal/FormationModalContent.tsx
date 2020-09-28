import React from 'react';
import DataStore from '../../util/dataStore';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers/rootReducer';
import { formationAction, FormationAction } from '../../reducers/slices/formationGridSlice';
import { formationModalAction, FormationModalAction } from '../../reducers/slices/formationModalSlice';
import SideBar from '../SideBar';
import ShipDetails from '../ShipDetails';
import RButton from '../RButton/RButton';
import ShipList from '../ShipList';

interface FormationModalProps {
  shipData: DataStore;
}
const FormationModalContent: React.FC<FormationModalProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const config = useSelector((state: RootState) => state.config);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);

  const addShip = () => {
    switch (appState.cToggle) {
      case 'ALL':
        dispatch(formationAction(FormationAction.AddShip));
        break;
      case 'OWNED':
        dispatch(formationAction(FormationAction.AddShip));
        break;
      default:
        break;
    }
    dispatch(formationModalAction(FormationModalAction.Close, appState.cToggle));
  };

  return (
    <>
      <SideBar shipData={shipData}>
        <ShipList shipData={shipData} shipSearchList={shipSearchList} listName={'ALL'} />
        <ShipList shipData={shipData} shipSearchList={ownedSearchList} listName={'OWNED'} />
      </SideBar>
      <div className={`ship-data-container ${config.themeColor}`}>
        <ShipDetails shipData={shipData} />
        {shipData.shipsArr[shipDetails.index] ? (
          <RButton themeColor={config.themeColor} onClick={addShip} extraStyle={{ marginTop: '5px', height: '50px' }}>
            Add to formation
          </RButton>
        ) : (
          <> </>
        )}
      </div>
    </>
  );
};

export default FormationModalContent;

FormationModalContent.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
