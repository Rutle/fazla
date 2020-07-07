import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { Skill } from './util/shipdata';

const ShipDetails: React.FC = () => {
  // const dispatch = useDispatch();
  const shipDetails = useSelector((state: RootState) => state.shipDetails);

  useEffect(() => {
    // console.log('details', shipDetails);
  }, [shipDetails]);
  return (
    <>
      <div>
        <h1>{shipDetails.names.code}</h1>
        <div id="passives">
          {shipDetails.skills?.map((skill: Skill) => {
            return (
              <div key={skill.names.en} className={skill.color}>
                <div>{skill.names.en}</div>
                <div>{skill.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ShipDetails;
