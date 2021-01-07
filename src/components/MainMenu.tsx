import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
/**
 * Component for main menu selection of different views.
 */
const MainMenu: React.FC = () => {
  const config = useSelector((state: RootState) => state.config);

  return (
    <div className={`top-container fixed`}>
      <nav className={`tab ${config.themeColor}`}>
        <NavLink to="/shipdetails">
          <span>Ships</span>
        </NavLink>
        <NavLink to="/formations">
          <span>Formations</span>
        </NavLink>
        <NavLink to="/options">
          <span>Options</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MainMenu;
