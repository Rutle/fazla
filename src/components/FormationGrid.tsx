/* eslint-disable react/prop-types */
import React from 'react';
interface FormationGridProps {
  themeColor: string;
  children: React.ReactNode;
}

const FormationGrid: React.FC<FormationGridProps> = ({ themeColor, children }) => {
  return (
    <>
      <div className={`f-grid ${themeColor}`}>
        <div className="f-row wrap">
          <div className="f-column">
            <div className="f-row">
              <div className="f-title">Main</div>
            </div>
            <div className="f-row">{React.Children.toArray(children).slice(0, 3)}</div>
          </div>
          <div className="f-column">
            <div className="f-row">
              <div className="f-title">Vanguard</div>
            </div>
            <div className="f-row">{React.Children.toArray(children).slice(3)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormationGrid;
