import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '_/App';
import { RootState } from '_/reducers/rootReducer';
import Toast from './Toast';

const ToastContainer: React.FC<{ position: string }> = ({ position = 'bottom-center' }) => {
  const { toasts } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  return (
    <div className={`toast-container ${config.themeColor} ${position}`}>
      {toasts.map((toastMsg) => {
        return (
          <Toast
            key={toastMsg.id}
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
