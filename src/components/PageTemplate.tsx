import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import TitleBar from './TitleBar';
import FooterBar from './FooterBar';
/**
 * Component for unified page template.
 */
const PageTemplate: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const config = useSelector((state: RootState) => state.config);

  return (
    <>
      <TitleBar showMenu />
      <div className={`page ${config.themeColor}`}>{children}</div>
      <FooterBar />
    </>
  );
};

export default PageTemplate;
