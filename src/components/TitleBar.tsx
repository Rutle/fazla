/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable react/prop-types */
import React, { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMinimize, faWindowMaximize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } from '../utils/appUtilities';
import { RootState } from '../reducers/rootReducer';
import CloseAppModalContent from './Modal/CloseAppModalContent';
import RButton from './RButton/RButton';

const NavItem: React.FC<{ children: ReactNode; pathTo: string }> = ({ children, pathTo }) => {
  const [isFocusOutline, setFocusOutline] = useState(false);
  return (
    <NavLink
      className={`${!isFocusOutline ? 'no-focus-outline' : ''}`}
      to={pathTo}
      onKeyUp={(e) => {
        if (e.key === 'Tab') {
          setFocusOutline(true);
        }
      }}
      onMouseDown={() => {
        if (isFocusOutline) setFocusOutline(false);
      }}
      onClick={(e) => {
        const { clientX, clientY } = e;
        if (clientX !== 0 && clientY !== 0) {
          setFocusOutline(false);
        } else {
          setFocusOutline(true);
        }
      }}
    >
      {children}
    </NavLink>
  );
};

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
            <div className="top-container">
              <nav className={`tab ${config.themeColor}`} aria-label="primary">
                <NavItem pathTo="/shipdetails">
                  <span>Ships</span>
                </NavItem>
                <NavItem pathTo="/formations">
                  <span>Formations</span>
                </NavItem>
                <NavItem pathTo="/options">
                  <span>Options</span>
                </NavItem>
              </nav>
            </div>
          </div>
        ) : (
          <>
            <div style={{ borderBottom: `1px solid var(--main-${config.themeColor}-border)` }} />
          </>
        )}
        <div id="window-filler" />
        <div id="window-controls">
          <RButton className="title-button" id="min-button" onClick={() => minimizeWindow()}>
            <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
          </RButton>
          {isMax ? (
            <RButton
              className="title-button"
              id="restore-button"
              onClick={() => {
                restoreWindow();
                setIsMax(false);
              }}
            >
              <FontAwesomeIcon icon={faWindowRestore} size="xs" />
            </RButton>
          ) : (
            <RButton
              className="title-button"
              id="max-button"
              onClick={() => {
                maximizeWindow();
                setIsMax(true);
              }}
            >
              <FontAwesomeIcon icon={faWindowMaximize} size="xs" />
            </RButton>
          )}
          <RButton
            className="title-button"
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
          </RButton>
        </div>
      </div>
      <ReactModal
        overlayClassName={`modal-overlay ${config.themeColor}`}
        isOpen={isModalOpen}
        className="modal-container"
        shouldCloseOnEsc
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
