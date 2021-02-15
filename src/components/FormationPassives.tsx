/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Ship } from '../types/types';
import PassivesList from './PassivesList';
import { CaretLeft } from './Icons';

interface FormationPassivesProps {
  fleet: Ship[];
  themeColor: string;
}

/**
 * Component for displaying passives of ships in a formation.
 */
const FormationPassives: React.FC<FormationPassivesProps> = ({ themeColor, fleet }) => {
  const [showMain, setShowMain] = useState(true);
  const [showVanguard, setShowVanguard] = useState(true);

  const isShip = (position: string) => {
    if (position === 'main') {
      return fleet.slice(0, 3).every((s) => s === undefined);
    }
    if (position === 'vanguard') {
      return fleet.slice(3, 6).every((s) => s === undefined);
    }
    return false;
  };

  const getData = (ship: Ship | undefined) => {
    if (ship) {
      return { optionalName: ship.names.en, skills: ship.skills };
    }
    return { optionalName: '', skills: undefined };
  };

  return (
    <div className={`f-grid ${themeColor}`}>
      {!isShip('main') ? (
        <>
          <div
            className="f-row action"
            onClick={() => {
              setShowMain(!showMain);
            }}
          >
            <div className={`f-icon plain ${showMain ? '' : 'open'}`}>
              <CaretLeft themeColor={themeColor} />
            </div>
            <div className="f-title plain">Main</div>
          </div>
          <div className={`f-collapsible ${showMain ? '' : 'f-collapsed'}`}>
            <div className="f-row">
              <div className="name f-header">Ship</div>
              <div className="passive f-header">Passive</div>
            </div>
            <PassivesList {...getData(fleet[0])} />
            <PassivesList {...getData(fleet[1])} />
            <PassivesList {...getData(fleet[2])} />
          </div>
        </>
      ) : (
        <></>
      )}
      {!isShip('vanguard') ? (
        <>
          <div className="f-row action" onClick={() => setShowVanguard(!showVanguard)}>
            <div className={`f-icon plain ${showVanguard ? '' : 'f-collapse'}`}>
              <CaretLeft themeColor={themeColor} />
            </div>
            <div className="f-title plain">Vanguard</div>
          </div>
          <div className={`f-collapsible ${showVanguard ? '' : 'f-collapsed'}`}>
            <div className="f-row">
              <div className="name f-header">Name</div>
              <div className="passive f-header">Passive</div>
            </div>
            <PassivesList {...getData(fleet[3])} />
            <PassivesList {...getData(fleet[4])} />
            <PassivesList {...getData(fleet[5])} />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FormationPassives;
