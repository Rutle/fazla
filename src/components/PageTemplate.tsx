import React from 'react';
/* import MainMenu from './MainMenu';*/
import TitleBar from './TitleBar';
import FooterBar from './FooterBar';
import { RootState } from '../reducers/rootReducer';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const PageTemplate: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const config = useSelector((state: RootState) => state.config);
  return (
    <>
      <TitleBar showMenu={true} />
      <div className={`page ${config.themeColor}`}>
        {/*<MainMenu />*/}
        {children}
      </div>
      <FooterBar />
    </>
  );
};

export default PageTemplate;
