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

interface FormationModalProps {
  shipData: DataStore;
}
const FormationModalContent: React.FC<FormationModalProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const config = useSelector((state: RootState) => state.config);

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
    dispatch(formationModalAction(FormationModalAction.Close));
  };
  return (
    <>
      <SideBar shipData={shipData} />
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
