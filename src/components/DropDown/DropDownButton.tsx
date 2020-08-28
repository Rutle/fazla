/* eslint-disable react/prop-types */
import React from 'react';
import Dropdown from 'react-overlays/Dropdown';
import DropDownMenu from './DropDownMenu';
import DropDownToggle from './DropDownToggle';

interface DropDownButtonProps {
  show: boolean;
  onToggle: (nextShow: boolean, event?: React.SyntheticEvent<Element, Event> | undefined) => void;
  drop: 'up' | 'down' | 'left' | 'right' | undefined;
  alignEnd: boolean | undefined;
}

const DropDownButton: React.FC<DropDownButtonProps> = ({ show, onToggle, drop, alignEnd }) => (
  <Dropdown show={show} onToggle={onToggle} drop={drop} alignEnd={alignEnd} itemSelector="button:not(:disabled)">
    {({ props }) => (
      <div {...props}>
        <DropDownToggle id="formation-toggle">
          <b>Formations</b>
        </DropDownToggle>
        <DropDownMenu />
      </div>
    )}
  </Dropdown>
);

export default DropDownButton;
