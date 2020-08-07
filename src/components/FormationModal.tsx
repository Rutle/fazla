/* eslint-disable react/prop-types */
import React from 'react';
import ReactModal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import ShipList from './ShipList';
import ShipDetails from './ShipDetails';
import { setShip } from '../reducers/slices/formationGridSlice';
// import { getShipById } from '../util/appUtilities';
import { closeModal } from '../reducers/slices/formationModalSlice';
import DataStore from '../util/dataStore';
import SideBar from './SideBar';

ReactModal.setAppElement('#root');
interface FormationModalProps {
  shipData: DataStore;
}
const FormationModal: React.FC<FormationModalProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const formationModal = useSelector((state: RootState) => state.formationModal);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const ownedSearch = useSelector((state: RootState) => state.ownedSearchList);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const addShipToFormation = () => {
    const n: number = appState[appState.cToggle].index;
    switch (appState.cToggle) {
      case 'all':
        // dispatch(setShip({ index: formationModal.gridIndex, data: getShipById(shipSearchList[n].id, true) }));
        break;
      case 'owned':
        // dispatch(setShip({ index: formationModal.gridIndex, data: getShipById(ownedSearch[n].id, true) }));
        break;
      default:
        break;
    }
    dispatch(closeModal());
  };

  return (
    <ReactModal
      isOpen={formationModal.isOpen}
      overlayClassName="formation-modal-overlay"
      className="formation-model-container dark"
      onRequestClose={() => dispatch(closeModal())}
    >
      <SideBar shipData={shipData} />
      <div className="ship-data-container dark">
        <div className="scroll">
          <ShipDetails ship={shipData.shipsArr[shipDetails.index]} />
          <button onClick={() => addShipToFormation()} className={`btn ${config.themeColor}`} type="button">
            <b>Add to formation</b>
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default FormationModal;
