/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { getShipById, Ship } from './util/shipdata';

const FormationShipPassives: React.FC<{ ship: Ship }> = ({ ship }) => {
  // const dispatch = useDispatch();
  const currentFormation = useSelector((state: RootState) => state.formationGrid);
  const listState = useSelector((state: RootState) => state.listState);
  const shipList = useSelector((state: RootState) => state.shipList);
  const config = useSelector((state: RootState) => state.config);

  const isShip = (): boolean => {
    console.log('FormationShipPassives', ship !== undefined);
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
