import React from 'react';
import PropTypes from 'prop-types';

interface RButtonProps {
  className?: string;
  children: React.ReactNode;
  themeColor: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  disabled?: boolean;
}

const RButton: React.FC<RButtonProps> = ({ className = 'btn normal', children, themeColor, onClick, disabled }) => {
  return (
    <button className={`${className} ${themeColor}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default RButton;

RButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  themeColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
