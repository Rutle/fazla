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
        <NavLink to="/shipdetails" activeStyle={selectedStyle}>
          [Ship list]
        </NavLink>
        <NavLink to="/docks" activeStyle={selectedStyle}>
          [Docks]
        </NavLink>
        <NavLink to="/formation" activeStyle={selectedStyle}>
          [Formation]
        </NavLink>
      </nav>
    </div>
  );
};

export default MainMenu;
