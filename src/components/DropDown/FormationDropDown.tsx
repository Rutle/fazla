import React, { useState } from 'react';
import DropDownButton from './DropDownButton';

const FormationDropDown: React.FC = () => {
  const [show, setShow] = useState(false);
  return <DropDownButton show={show} onToggle={(nextShow) => setShow(nextShow)} drop="down" alignEnd={true} />;
};

export default FormationDropDown;
