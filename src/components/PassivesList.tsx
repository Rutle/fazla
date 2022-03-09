import React from 'react';
import { Skill } from '_/types/shipTypes';

interface PassiveProps {
  optionalName?: string;
  skills?: Skill[];
  hullType?: string;
}
/**
 * Component for listing passives of a ship.
 */
const PassivesList: React.FC<PassiveProps> = ({ optionalName, skills, hullType }) => {
  // console.log(`Render PassiveList`);
  return (
    <>
      {skills !== undefined ? (
        skills?.map((skill: Skill, idx) => {
          return (
            <div key={`${skill.names.en}-${idx * skills.length}`} className={`f-row passive-item ${skill.color}`}>
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

export default React.memo(PassivesList);
