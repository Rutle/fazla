import React from 'react';
import { Skill } from '../util/shipdatatypes';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

interface PassiveProps {
  orient?: string;
  page?: string;
}

const PassivesList: React.FC<PassiveProps> = ({ orient = 'vertical', page }: PassiveProps) => {
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  return (
    <div id="passives" className={`container ${orient}`}>
      {shipDetails.skills?.map((skill: Skill) => {
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
