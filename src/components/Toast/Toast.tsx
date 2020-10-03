/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
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

const Toast: React.FC<ToastProps> = React.memo(({ position, type, label, msg, toastId }) => {
  const { onToastDismiss } = useContext(AppContext);
  const [state, setState] = useState({
    onEntering: true,
    onEnter: false,
    onExiting: false,
    onExit: false,
  });
  return (
    <div
      className={`toast ${type} ${position} ${state.onEntering ? 'from-right' : ''} ${
        state.onExiting ? 'to-right' : ''
      }`}
      onAnimationEnd={() => {
        if (state.onEntering) {
          setState({ ...state, onEntering: false, onEnter: true });
        } else if (state.onExiting) {
          onToastDismiss(toastId);
        }
      }}
    >
      <div
        className="toast-icon"
        onClick={() => {
          setState({ ...state, onExiting: true });
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
});

export default Toast;
