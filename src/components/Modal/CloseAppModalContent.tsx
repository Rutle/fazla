import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers/rootReducer';
import PropTypes from 'prop-types';
import RButton from '../RButton/RButton';
import { closeWindow } from '../../util/appUtilities';
import { FormationAction, formationAction } from '../../reducers/slices/formationGridSlice';

ReactModal.setAppElement('#root');

const CloseAppModalContent: React.FC<{ setModalOpen: (e: boolean) => void }> = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const formationGrid = useSelector((state: RootState) => state.formationGrid);

  useEffect(() => {
    if (!config.isEdit && formationGrid.isEdit.every((val) => val !== true)) {
      closeWindow();
    }
  }, [config.isEdit, formationGrid.isEdit]);

  return (
    <>
      <div className="modal-title">Warning</div>
      <div className="modal-content">
        <div>There are unsaved changes in formations.</div>
      </div>
      <div className="modal-action">
        <div className="button-group">
        <RButton themeColor={config.themeColor} onClick={() => closeWindow()}>
          Close without saving
        </RButton>
        <RButton
          themeColor={config.themeColor}
          onClick={() => {
            dispatch(formationAction(FormationAction.Save));
          }}
        >
          Save and exit
        </RButton>
        <RButton themeColor={config.themeColor} onClick={() => setModalOpen(false)}>
          Cancel
        </RButton>
        </div>
      </div>
    </>
  );
};

export default CloseAppModalContent;

CloseAppModalContent.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
};
