/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppContext } from '../../App';

interface ToastProps {
  position: string;
  type: string;
  label: string;
  msg: string;
  toastId: number;
}

const Toast: React.FC<ToastProps> = ({ position, type, label, msg, toastId }) => {
  const { onToastDismiss } = useContext(AppContext);
  return (
    <div className={`toast ${type} ${position}`}>
      <div
        className="toast-icon"
        onClick={() => {
          onToastDismiss(toastId);
        }}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
      <div className="toast-right-content">
        <div className="toast-title">{label}</div>
        <div className="toast-message">{msg}</div>
      </div>
    </div>
  );
};

export default Toast;
