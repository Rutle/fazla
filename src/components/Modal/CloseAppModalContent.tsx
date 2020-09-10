import React from 'react';
import ReactModal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers/rootReducer';
import PropTypes from 'prop-types';
import RButton from '../RButton/RButton';

ReactModal.setAppElement('#root');

const CloseAppModalContent: React.FC<{ setModalOpen: (e: boolean) => void }> = ({ setModalOpen }) => {
  const config = useSelector((state: RootState) => state.config);

  return (
    <>
      <p>There are unsaved changes in formations.</p>
      <div className="button-group">
        <RButton themeColor={config.themeColor} onClick={() => setModalOpen(false)}>
          Close without saving
        </RButton>
        <RButton themeColor={config.themeColor} onClick={() => console.log('save')}>
          Save and exit
        </RButton>
      </div>
    </>
  );
};

export default CloseAppModalContent;

CloseAppModalContent.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
};
