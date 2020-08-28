import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

interface MenuProps {
  setActiveTab: (event: React.SetStateAction<string>) => void;
  currentActiveTab: string;
  tabs: string[];
  children: JSX.Element;
}

// eslint-disable-next-line react/prop-types
const Menu: React.FC<MenuProps> = ({ setActiveTab, currentActiveTab, tabs, children }) => {
  const config = useSelector((state: RootState) => state.config);

  return (
    <div className={`tab dark`}>
      <button
        className={`tab-btn ${config.themeColor} ${currentActiveTab === tabs[0] ? 'active' : ''}`}
        onClick={() => setActiveTab(tabs[0])}
      >
        {tabs[0]}
      </button>
      <button
        className={`tab-btn ${config.themeColor} ${currentActiveTab === tabs[1] ? 'active' : ''}`}
        onClick={() => setActiveTab(tabs[1])}
      >
        {tabs[1]}
      </button>
      <button
        className={`tab-btn ${config.themeColor} ${currentActiveTab === tabs[2] ? 'active' : ''}`}
        onClick={() => setActiveTab(tabs[2])}
      ></button>
      {children}
    </div>
  );
};

export default Menu;
