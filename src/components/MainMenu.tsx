import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

const MainMenu: React.FC = () => {
  const config = useSelector((state: RootState) => state.config);
  return (
    <div className={`top-container fixed`}>
      <nav className={`tab ${config.themeColor}`}>
        <NavLink to="/options">Options</NavLink>
        <NavLink to="/shipdetails">Ships</NavLink>
        <NavLink to="/formations">Formations</NavLink>
      </nav>
    </div>
  );
};

export default MainMenu;
