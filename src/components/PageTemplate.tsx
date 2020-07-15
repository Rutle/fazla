import React from 'react';
import MainMenu from './MainMenu';

// eslint-disable-next-line react/prop-types
const PageTemplate: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <div className="page">
      <MainMenu />
      {children}
    </div>
  );
};

export default PageTemplate;
