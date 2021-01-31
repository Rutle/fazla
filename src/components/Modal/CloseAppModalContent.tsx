import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { RootState } from '../../reducers/rootReducer';
import RButton from '../RButton/RButton';
import { closeWindow } from '../../utils/appUtilities';
import { FormationAction, formationAction } from '../../reducers/slices/formationGridSlice';
import { AppConfigAction, configAction } from '../../reducers/slices/programConfigSlice';

ReactModal.setAppElement('#root');

const CloseAppModalContent: React.FC<{ setModalOpen: (e: boolean) => void }> = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const formationGrid = useSelector((state: RootState) => state.formationGrid);

  useEffect(() => {
    if (!(config.isEdit || formationGrid.isEdit.some((val) => val !== false))) {
      closeWindow();
    }
  }, [config.isEdit, formationGrid.isEdit]);

  return (
    <>
      <div className="modal-title">Warning</div>
      <div className="modal-content">
        <div>There are unsaved changes.</div>
      </div>
      <div className="modal-action">
        <div className="button-group borderless">
          <RButton themeColor={config.themeColor} onClick={() => closeWindow()}>
            Exit w/o saving
          </RButton>
          <RButton
            themeColor={config.themeColor}
            onClick={() => {
              if (formationGrid.isEdit.some((val) => val !== false)) {
                dispatch(formationAction(FormationAction.Save));
              }
              if (config.isEdit) {
                dispatch(configAction(AppConfigAction.Save));
              }
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
