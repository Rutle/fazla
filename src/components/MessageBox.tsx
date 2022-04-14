import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';

const MessageBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useSelector((state: RootState) => state.config);
  return (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'center' }}>
      <div
        className={`message-container ${config.themeColor}`}
        style={{
          alignSelf: 'center',
          minHeight: '40px',
        }}
      >
        <span className="message" style={{ justifyContent: 'center', width: '100%' }}>
          {children}
        </span>
      </div>
    </div>
  );
};

export default MessageBox;
