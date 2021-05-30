import React from 'react';
import { Skill } from '_/types/types';

interface PassiveProps {
  optionalName?: string;
  skills?: Skill[];
  hullType?: string;
}
/**
 * Component for listing passives of a ship.
 */
const PassivesList: React.FC<PassiveProps> = ({ optionalName, skills, hullType }) => {
  return (
    <>
      {skills !== undefined ? (
        skills?.map((skill: Skill) => {
          return (
            <div key={skill.names.en} className={`f-row passive-list ${skill.color}`}>
              <div className={`grid-item name ${hullType || ''}`}>
                {optionalName !== undefined ? optionalName : skill.names.en}
              </div>
              <div className="grid-item passive">{skill.description}</div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default PassivesList;
