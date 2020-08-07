import React, { useState } from 'react';
import { RootState } from '../reducers/rootReducer';
import { useSelector } from 'react-redux';

const FooterBar: React.FC = () => {
  const appState = useSelector((state: RootState) => state.appState);

  return (
    <div id="footer">
      <div id="footer-state-msg">
        <span>{appState.cMsg}</span>
      </div>
    </div>
  );
};

export default FooterBar;
