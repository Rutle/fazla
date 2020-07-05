import React from 'react';
import { NavLink } from 'react-router-dom';

interface styleInterface {
  backgroundColor: string;
  color: string;
  border: string;
  borderBottom: string;
}

const selectedStyle: styleInterface = {
  backgroundColor: '#353b48',
  color: 'white',
  border: '1px solid #353b48',
  borderBottom: '0px',
};

const MainMenu = (): JSX.Element => {
  return (
    <div className="main-menu">
      <nav>
        <NavLink to="/home" activeStyle={selectedStyle}>
          [Home]
        </NavLink>
        <NavLink to="/shiplist" activeStyle={selectedStyle}>
          [Ship list]
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
