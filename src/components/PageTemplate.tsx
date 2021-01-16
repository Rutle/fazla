import React from 'react';
import { useSelector } from 'react-redux';
import TitleBar from './TitleBar';
import FooterBar from './FooterBar';
import { RootState } from '../reducers/rootReducer';
/**
 * Component for unified page template.
 */
// eslint-disable-next-line react/prop-types
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
