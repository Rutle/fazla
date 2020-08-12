import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

const MainMenu: React.FC = () => {
  const config = useSelector((state: RootState) => state.config);
  return (
    <div className={`top-container fixed`}>
      <nav className={`tab ${config.themeColor}`}>
        <NavLink to="/home">[Home]</NavLink>
        <NavLink to="/shipdetails">[Ship list]</NavLink>
        <NavLink to="/formation">[Formation]</NavLink>
      </nav>
    </div>
  );
};

export default MainMenu;
