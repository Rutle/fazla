import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMinimize, faWindowMaximize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } from '../util/appUtilities';
import { RootState } from '../reducers/rootReducer';
import CloseAppModalContent from './Modal/CloseAppModalContent';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

const TitleBar: React.FC = () => {
  const formGrid = useSelector((state: RootState) => state.formationGrid);
  const config = useSelector((state: RootState) => state.config);
  const [isMax, setIsMax] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEdit = () => {
    return formGrid.isEdit.some((status) => status === true);
  };

  return (
    <header id="titlebar">
      <div id="drag-region">
        <div id="window-title">
          <span>Azur Lane</span>
        </div>
        <div id="window-controls">
          <div
            className="title-button"
            id="min-button"
            onClick={() => {
              minimizeWindow();
            }}
          >
            <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
          </div>
          <div
            className={`title-button ${isMax ? 'hidden' : ''}`}
            id="max-button"
            onClick={() => {
              maximizeWindow();
              setIsMax(true);
            }}
          >
            <FontAwesomeIcon icon={faWindowMaximize} size="xs" />
          </div>
          <div
            className={`title-button ${isMax ? '' : 'hidden'}`}
            id="restore-button"
            onClick={() => {
              restoreWindow();
              setIsMax(false);
            }}
          >
            <FontAwesomeIcon icon={faWindowRestore} size="xs" />
          </div>
          <div
            className="button title-button"
            id="close-button"
            onClick={() => {
              if (isEdit()) {
                setModalOpen(!isModalOpen);
              } else {
                closeWindow();
              }
            }}
          >
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </div>
        </div>
      </div>
      <ReactModal
        overlayClassName={`modal-overlay ${config.themeColor}`}
        isOpen={isModalOpen}
        className={`modal-container`}
        shouldCloseOnEsc={true}
        onRequestClose={() => setModalOpen(false)}
      >
        <CloseAppModalContent setModalOpen={setModalOpen} />
      </ReactModal>
    </header>
  );
};

export default TitleBar;
