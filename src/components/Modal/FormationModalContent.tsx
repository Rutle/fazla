import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { RootState } from '_/reducers/rootReducer';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import { formationModalAction, FormationModalAction } from '_/reducers/slices/formationModalSlice';
import SideBar from '../SideBar';
import ShipDetails from '../ShipDetails';
import RButton from '../RButton/RButton';
import ShipList from '../ShipList';
import { AppContext } from '../../App';

interface FormModalProps {
  setModalOpen: (openProp: { modal: string; isOpen: boolean }) => void;
}

const FormationModalContent: React.FC<FormModalProps> = ({ setModalOpen }) => {
  const { shipData } = useContext(AppContext);
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);

  const addShip = () => {
    switch (appState.cToggle) {
      case 'ALL':
        dispatch(formationAction(FormationAction.AddShip, {}));
        break;
      case 'OWNED':
        dispatch(formationAction(FormationAction.AddShip, {}));
        break;
      default:
        break;
    }
    dispatch(formationModalAction(FormationModalAction.Close, appState.cToggle, 0, shipData));
    setModalOpen({ modal: '', isOpen: false });
  };

  return (
    <>
      <SideBar>
        <ShipList shipSearchList={shipSearchList} listName="ALL" />
        <ShipList shipSearchList={ownedSearchList} listName="OWNED" />
      </SideBar>
      <div className={`ship-data-container ${config.themeColor}`}>
        <ShipDetails />
        {shipData.getShips()[appState[appState.cToggle].index] ? (
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
  setModalOpen: PropTypes.func.isRequired,
};
