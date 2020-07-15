import React from 'react';
import { Skill } from './util/shipdata';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

interface PassiveProps {
  orient?: string;
  page?: string;
}

const PassivesList: React.FC<PassiveProps> = ({ orient = 'vertical', page }: PassiveProps) => {
  // const dispatch = useDispatch();
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  // const ownedShips = useSelector((state: RootState) => state.ownedShips);
  // const config = useSelector((state: RootState) => state.config);
  // const listState = useSelector((state: RootState) => state.listState);
  // const config = useSelector((state: RootState) => state.config);

  return (
    <div id="passives" className={`container ${orient} ${page}`}>
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
