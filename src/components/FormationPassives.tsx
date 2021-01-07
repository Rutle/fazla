/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formation, Ship } from '../util/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import PassivesList from './PassivesList';
interface FormationPassivesProps {
  formation: Formation;
  themeColor: string;
  formationShips: { [key: string]: Ship };
}

/**
 * Component for displaying passives of ships in a formation.
 */
const FormationPassives: React.FC<FormationPassivesProps> = ({ formation, themeColor, formationShips }) => {
  const [showMain, setShowMain] = useState(true);
  const [showVanguard, setShowVanguard] = useState(true);

  const isShip = (position: string) => {
    if (position === 'main') {
      return formation.data.slice(0, 3).every((s) => s === 'NONE');
    } else if (position === 'vanguard') {
      return formation.data.slice(3, 6).every((s) => s === 'NONE');
    } else {
      return false;
    }
  };

  const getData = (id: string) => {
    if (formationShips[id]) {
      return { optionalName: formationShips[id].names.en, skills: formationShips[id].skills };
    }
  };

  return (
    <div className={`f-grid ${themeColor}`}>
      {!isShip('main') ? (
        <>
          <div
            className={'f-row action'}
            onClick={() => {
              setShowMain(!showMain);
            }}
          >
            <div className={`f-icon ${showMain ? '' : 'f-collapse'}`}>
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
            <div className="f-title">Main</div>
          </div>
          <div className={`f-collapsible ${showMain ? '' : 'f-collapsed'}`}>
            <div className={`f-row`}>
              <div className={'name f-header'}>Ship</div>
              <div className={'passive f-header'}>Passive</div>
            </div>
            <PassivesList {...getData(formation.data[0])} />
            <PassivesList {...getData(formation.data[1])} />
            <PassivesList {...getData(formation.data[2])} />
          </div>
        </>
      ) : (
        <></>
      )}
      {!isShip('vanguard') ? (
        <>
          <div className={'f-row action'} onClick={() => setShowVanguard(!showVanguard)}>
            <div className={`f-icon ${showVanguard ? '' : 'f-collapse'}`}>
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
            <div className="f-title">Vanguard</div>
          </div>
          <div className={`f-collapsible ${showVanguard ? '' : 'f-collapsed'}`}>
            <div className={'f-row'}>
              <div className={'name f-header'}>Name</div>
              <div className={'passive f-header'}>Passive</div>
            </div>
            <PassivesList {...getData(formation.data[3])} />
            <PassivesList {...getData(formation.data[4])} />
            <PassivesList {...getData(formation.data[5])} />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FormationPassives;

FormationPassives.propTypes = {
  themeColor: PropTypes.string.isRequired,
};
