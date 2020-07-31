import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMinimize, faWindowMaximize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { closeWindow, minimizeWindow, maximizeWindow, restoreWindow, getConfig } from '../util/appUtilities';

const TitleBar: React.FC = () => {
  const [isMax, setIsMax] = useState(false);
  return (
    <header id="titlebar">
      <div id="drag-region">
        <div id="window-title">
          <span>Azur Lane</span>
        </div>
        <div id="window-controls">
          <div
            className="button"
            id="min-button"
            onClick={() => {
              minimizeWindow();
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
