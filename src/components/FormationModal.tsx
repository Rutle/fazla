import React from 'react';
import ReactModal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import ShipList from './ShipList';
import ShipDetails from './ShipDetails';
import { setShip } from '../reducers/slices/formationGridSlice';
import { getShipById } from './util/shipdata';
import { closeModal } from '../reducers/slices/formationModalSlice';

ReactModal.setAppElement('#root');

const FormationModal: React.FC = () => {
  const dispatch = useDispatch();
  const formationModal = useSelector((state: RootState) => state.formationModal);
  // const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  // const shipDetails = useSelector((state: RootState) => state.shipDetails);
  // const currentFormation = useSelector((state: RootState) => state.formationGrid);
  const listState = useSelector((state: RootState) => state.listState);
  const shipList = useSelector((state: RootState) => state.shipList);
  const ownedSearch = useSelector((state: RootState) => state.ownedSearchList);
  // const [isShips, setIsShips] = useState(ownedShips.length > 0);

  const addShipToFormation = () => {
    const n: number = listState[listState.currentToggle].index;
    switch (listState.currentToggle) {
      case 'all':
        // dispatch(setShip({ index, data: shipList[n] }));
        dispatch(setShip({ index: formationModal.gridIndex, data: getShipById(shipList[n].id) }));
        break;
      case 'owned':
        dispatch(setShip({ index: formationModal.gridIndex, data: getShipById(ownedSearch[n].id) }));
        break;
      default:
        break;
    }
    dispatch(closeModal());
  };
  /*
  useEffect(() => {
    // Check if there any ships left.
    setIsShips(ownedShips.length > 0);
    // dispatch(dispatch(setDetails(getShipById(data.ships[0].id)));)
  }, [ownedShips]);
*/
  return (
    <ReactModal
      isOpen={formationModal.isOpen}
      contentLabel="onRequestClose Example"
      overlayClassName="formation-modal-overlay"
      className="formation-model-container dark"
      onRequestClose={() => dispatch(closeModal())}
    >
      <ShipList />
      <div className="ship-data-container dark">
        <ShipDetails />
        <div className={'button-group'}>
          <button onClick={() => addShipToFormation()} className={`btn ${config.themeColor}`} type="button">
            <b>Add to formation</b>
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default FormationModal;
