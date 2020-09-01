import React from 'react';
import ReactModal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import ShipDetails from './ShipDetails';
import { closeModal } from '../reducers/slices/formationModalSlice';
import DataStore from '../util/dataStore';
import SideBar from './SideBar';
import PropTypes from 'prop-types';
import { formationAction, FormationAction } from '../reducers/slices/formationGridSlice';

ReactModal.setAppElement('#root');
interface FormationModalProps {
  shipData: DataStore;
}
const FormationModal: React.FC<FormationModalProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const formationModal = useSelector((state: RootState) => state.formationModal);
  const appState = useSelector((state: RootState) => state.appState);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const config = useSelector((state: RootState) => state.config);

  const addShip = () => {
    switch (appState.cToggle) {
      case 'all':
        dispatch(formationAction(FormationAction.AddShip));
        break;
      case 'owned':
        dispatch(formationAction(FormationAction.AddShip));
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
          <button onClick={() => addShip()} className={`btn ${config.themeColor}`} type="button">
            <b>Add to formation</b>
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default FormationModal;

FormationModal.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
