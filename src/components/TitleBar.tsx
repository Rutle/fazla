import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMinimize, faWindowMaximize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } from '../utils/appUtilities';
import { RootState } from '../reducers/rootReducer';
import CloseAppModalContent from './Modal/CloseAppModalContent';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';

ReactModal.setAppElement('#root');
/**
 * Component for titlebar.
 */
const TitleBar: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  const formGrid = useSelector((state: RootState) => state.formationGrid);
  const config = useSelector((state: RootState) => state.config);
  const [isMax, setIsMax] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEdit = () => {
    return config.isEdit || formGrid.isEdit.some((val) => val !== false);
  };

  return (
    <header id="titlebar" className={`${config.themeColor}`}>
      <div id="drag-region">
        <div id="window-title">
          <span>Formation tool</span>
        </div>
        {showMenu ? (
          <div id="window-menu">
            <div className={`top-container`}>
              <nav className={`tab ${config.themeColor}`}>
                <NavLink to="/shipdetails">
                  <span>Ships</span>
                </NavLink>
                <NavLink to="/formations">
                  <span>Formations</span>
                </NavLink>
                <NavLink to="/options">
                  <span>Options</span>
                </NavLink>
              </nav>
            </div>
          </div>
        ) : (
          <>
            <div style={{ borderBottom: `1px solid var(--main-${config.themeColor}-border)` }}></div>
          </>
        )}
        <div id="window-filler"></div>
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
          {isMax ? (
            <div
              className={`title-button`}
              id="restore-button"
              onClick={() => {
                restoreWindow();
                setIsMax(false);
              }}
            >
              <FontAwesomeIcon icon={faWindowRestore} size="xs" />
            </div>
          ) : (
            <div
              className={`title-button`}
              id="max-button"
              onClick={() => {
                maximizeWindow();
                setIsMax(true);
              }}
            >
              <FontAwesomeIcon icon={faWindowMaximize} size="xs" />
            </div>
          )}

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

TitleBar.propTypes = {
  showMenu: PropTypes.bool.isRequired,
};
