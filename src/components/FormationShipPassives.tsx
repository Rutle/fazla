/* eslint-disable react/prop-types */
import React from 'react';
import { Ship } from '../util/shipdatatypes';

const FormationShipPassives: React.FC<{ ship: Ship }> = ({ ship }) => {
  const isShip = (): boolean => {
    return ship !== undefined;
  };

  return (
    <>
      {isShip() ? (
        ship.skills?.map((skill) => {
          return (
            <div key={skill.names.en} className={`f-row ${skill.color}`}>
              <div className={'grid-item name'}>{ship.names.en}</div>
              <div className={'grid-item passive'}>{skill.description}</div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default FormationShipPassives;
