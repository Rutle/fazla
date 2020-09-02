/* eslint-disable react/prop-types */
import React from 'react';
import { Skill, Ship } from '../util/shipdatatypes';

interface PassiveProps {
  orient?: string;
  page?: string;
  ship: Ship;
}

const PassivesList: React.FC<PassiveProps> = ({ orient = 'vertical', page, ship }) => {
  return (
    <div className={`passives-container ${orient}`}>
      {ship.skills?.map((skill: Skill) => {
        return (
          <div key={skill.names.en} className={skill.color}>
            <div>{skill.names.en}</div>
            <div>{skill.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PassivesList;
