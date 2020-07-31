import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMinimize, faWindowMaximize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { closeWindow, minimizeWindow, maximizeWindow, restoreWindow, saveShipData } from '../util/appUtilities';
import { RootState } from '../reducers/rootReducer';
import { useSelector } from 'react-redux';

const TitleBar: React.FC = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const [isMax, setIsMax] = useState(false);
  return (
    <header id="titlebar">
      <div id="drag-region">
        <div id="window-title">
          <span>Azur Lane</span>
        </div>
        <div id="window-title-state">
          <span>{appState.cMsg}</span>
        </div>
        <div id="window-controls">
          <div
            className="button"
            id="min-button"
            onClick={() => {
              minimizeWindow();
              // saveShipData();
            }}
          >
            <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
          </div>
          <div
            className={`button ${isMax ? 'hidden' : ''}`}
            id="max-button"
            onClick={() => {
              maximizeWindow();
              setIsMax(true);
            }}
          >
            <FontAwesomeIcon icon={faWindowMaximize} size="xs" />
          </div>
          <div
            className={`button ${isMax ? '' : 'hidden'}`}
            id="restore-button"
            onClick={() => {
              restoreWindow();
              setIsMax(false);
            }}
          >
            <FontAwesomeIcon icon={faWindowRestore} size="xs" />
          </div>
          <div className="button" id="close-button" onClick={() => closeWindow()}>
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TitleBar;
