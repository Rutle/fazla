/* eslint-disable react/prop-types */
import React from 'react';

interface InfoButtonProps {
  buttonAction: () => void;
  classes: string;
  text: string;
  width: string;
}

const InfoButton: React.FC<InfoButtonProps> = ({ buttonAction, classes, text, width }) => {
  return (
    <button className={`${classes}`} style={{ width: width, height: '25px' }} onClick={() => buttonAction()}>
      <b>{`${text}`}</b>
    </button>
  );
};

export default InfoButton;
