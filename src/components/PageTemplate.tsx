import React from 'react';
import MainMenu from './MainMenu';

const PageTemplate: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <div className="page">
      <MainMenu />
      {children}
    </div>
  );
};

export default PageTemplate;
