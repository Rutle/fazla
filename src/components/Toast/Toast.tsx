/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeToastById } from '../../reducers/slices/toastSlice';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ToastProps {
  index: number;
  position: string;
  type: string;
  label: string;
  msg: string;
  toastId: number;
}

const Toast: React.FC<ToastProps> = ({ index, position, type, label, msg, toastId }) => {
  const dispatch = useDispatch();
  return (
    <div key={`${msg}-${index}`} className={`toast ${type} ${position}`}>
      <div
        className="toast-icon"
        onClick={() => {
          (async () => {
            dispatch(removeToastById(toastId));
          })();
        }}
        onAnimationEnd={() => console.log('ani end')}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
      <div className="toast-title">{label}</div>
      <div className="toast-message">{msg}</div>
    </div>
  );
};

export default Toast;
