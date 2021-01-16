/* eslint-disable react/prop-types */
import React, { CSSProperties } from 'react';

interface FormationGridProps {
  themeColor: string;
  children: React.ReactNode;
  isTitle: boolean;
}

/**
 * Component presenting ships in a grid.
 */
const FormationGrid: React.FC<FormationGridProps> = ({ themeColor, children, isTitle }) => {
  const middleStyle: CSSProperties = { borderTop: `1px solid var(--main-${themeColor}-border)`, paddingTop: '5px' };
  return (
    <>
      <div className={`f-grid ${themeColor}`}>
        <div className="f-row wrap">
          <div className="f-column">
            {isTitle ? (
              <div className="f-row">
                <div className="f-title">Main</div>
              </div>
            ) : (
              <></>
            )}
            <div className="f-row" style={!isTitle ? middleStyle : {}}>
              {React.Children.toArray(children).slice(0, 3)}
            </div>
          </div>
          <div className="f-column">
            {isTitle ? (
              <div className="f-row">
                <div className="f-title">Vanguard</div>
              </div>
            ) : (
              <></>
            )}
            <div className="f-row" style={!isTitle ? middleStyle : {}}>
              {React.Children.toArray(children).slice(3)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormationGrid;
