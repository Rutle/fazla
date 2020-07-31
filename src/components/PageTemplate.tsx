import React from 'react';
import MainMenu from './MainMenu';
import TitleBar from './TitleBar';

// eslint-disable-next-line react/prop-types
const PageTemplate: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <>
      <TitleBar />
      <div className="page">
        <MainMenu />
        {children}
      </div>
    </>
  );
};

export default PageTemplate;
