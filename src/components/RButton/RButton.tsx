/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

interface RButtonProps {
  className?: string;
  children: React.ReactNode;
  themeColor: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  disabled?: boolean;
  extraStyle?: React.CSSProperties;
}

const RButton: React.FC<RButtonProps> = React.memo(
  ({ className = 'btn normal graphic', children, themeColor, onClick, disabled, extraStyle }) => {
    return (
      <button className={`${className} ${themeColor}`} onClick={onClick} disabled={disabled} style={extraStyle}>
        {children}
      </button>
    );
  },
);

export default RButton;

RButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  themeColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  extraStyle: PropTypes.object,
};
