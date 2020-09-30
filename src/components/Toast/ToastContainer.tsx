/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../App';
import Toast from './Toast';

interface ToastContainerProps {
  position?: string;
  timeout?: number;
  autoDismiss?: true;
}
/**
 * Toast container component
 * @param {string} position Position: bottom-center, top-center, bottom-right
 * @param {number} timeout Timeout.
 * @param {boolean} autoDismiss Boolean.
 * @param {callback} onDismiss Function to be called on dismiss.
 * @param {function} dismissToast
 */
const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'bottom-center',
  timeout = 3000,
  autoDismiss = true,
}) => {
  const { onToastDismiss, popToast, toasts } = useContext(AppContext);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (autoDismiss && toasts.length) {
        if (toasts[0].isCallback) {
          onToastDismiss(toasts[0].id);
        }
        popToast();
      }
    }, timeout);
    intervalRef.current = interval;
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [toasts, autoDismiss, onToastDismiss, timeout, popToast]);
  return (
    <div className={`toast-container ${position}`}>
      {toasts.map((toastMsg, index) => {
        return (
          <Toast
            key={`${index}-${toastMsg.msg}`}
            index={index}
            position={position}
            type={toastMsg.type}
            label={toastMsg.label}
            msg={toastMsg.msg}
            toastId={toastMsg.id}
          />
        );
      })}
    </div>
  );
};

export default ToastContainer;
