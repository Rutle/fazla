import React from 'react';

interface RIconProps {
  className?: string;
  children: React.ReactNode;
  themeColor?: string;
  actionClass: string;
  action: React.Dispatch<React.SetStateAction<boolean>>;
  isAction?: boolean;
  extraStyle?: React.CSSProperties;
}

const RIcon: React.FC<RIconProps> = React.memo(
  ({ className = 'f-icon action', actionClass = '', children, action, extraStyle, isAction }) => {
    return (
      <div
        className={`${className} ${!isAction ? actionClass : ''}`}
        style={extraStyle}
        tabIndex={0}
        role="button"
        onClick={() => {
          action(!isAction);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            action(!isAction);
          }
        }}
      >
        {children}
      </div>
    );
  }
);
export default RIcon;
