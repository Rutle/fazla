/* eslint-disable react/prop-types */
import React from 'react';
import ReactModal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import ShipDetails from './ShipDetails';
import { addShipToFormation } from '../reducers/slices/formationGridSlice';
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
  const appState = useSelector((state: RootState) => state.appState);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);

  const addShip = () => {
    switch (appState.cToggle) {
      case 'all':
        dispatch(addShipToFormation({ index: formationModal.gridIndex, id: shipDetails.id }));
        break;
      case 'owned':
        dispatch(addShipToFormation({ index: formationModal.gridIndex, id: shipDetails.id }));
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
          <button onClick={() => addShip()} className={`btn ${appState.themeColor}`} type="button">
            <b>Add to formation</b>
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default FormationModal;
