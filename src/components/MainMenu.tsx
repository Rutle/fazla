import React from 'react';
import { NavLink } from 'react-router-dom';

interface styleInterface {
  backgroundColor: string;
  color: string;
}

const selectedStyle: styleInterface = {
  backgroundColor: 'rgba(176, 196, 222, 0.2)',
  color: 'white',
};

const MainMenu = (): JSX.Element => {
  return (
    <div className="main-menu">
      <nav>
        <NavLink to="/home" activeStyle={selectedStyle}>
          [Home]
        </NavLink>
        <NavLink to="/list" activeStyle={selectedStyle}>
          [List]
        </NavLink>
        <NavLink to="/products" activeStyle={selectedStyle}>
          [Placeholder]
        </NavLink>
        <NavLink to="/contact" activeStyle={selectedStyle}>
          [Placeholder]
        </NavLink>
      </nav>
    </div>
  );
};

export default MainMenu;
