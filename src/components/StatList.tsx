import React, { useEffect, useState } from 'react';
import { statCatAbb, statsAbb } from '_/data/categories';
import { isStat, ShipStats } from '_/types/shipTypes';
import RButton from './RButton/RButton';

const StatList: React.FC<{ stats: ShipStats; themeColor: string }> = ({ stats, themeColor }) => {
  const statKeys = Object.keys(stats);
  const [selectedStats, setSelectedStats] = useState(0);

  useEffect(() => {
    setSelectedStats(0);
  }, [stats]);

  return (
    <>
      <div className={`f-row ${themeColor}`}>
        <div className="f-header">Stats</div>
        <div className="f-header tab-group">
          {stats ? (
            <>
              {statKeys.map((cat, index) => (
                <RButton
                  key={`btn-${cat}`}
                  themeColor={themeColor}
                  className={`tab-btn normal${selectedStats === index ? ' selected' : ''}`}
                  onClick={() => setSelectedStats(index)}
                >
                  {statCatAbb[cat]}
                </RButton>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      {stats ? (
        statKeys.map((key, idx) => {
          const statArr = Object.keys(stats[key]);
          const tempArr = [];
          for (let i = 0; i < statArr.length; i += 4) {
            const temp = statArr.slice(i, i + 4);
            tempArr.push(
              <tr key={`${key}-${i + 4}`} className="f-table-row">
                {temp.map((stat) => {
                  const len = temp.length;
                  if (isStat(stat) && len === 4) {
                    return (
                      <td key={`${key}-${stat}`} className="stat-item">{`${statsAbb[stat]}: ${stats[key][stat]}`}</td>
                    );
                  }
                  if (isStat(stat) && len < 4 && len >= 1) {
                    return (
                      <React.Fragment key={`${key}-${stat}`}>
                        <td className="stat-item">{`${statsAbb[stat]}: ${stats[key][stat]}`}</td>
                        <td colSpan={4 - len} className="stat-item filler" />
                      </React.Fragment>
                    );
                  }
                  return <></>;
                })}
              </tr>
            );
          }
          return (
            <div
              key={`div-${key}`}
              className={`f-column f-body ${themeColor} ${selectedStats !== idx ? 'hidden' : ''}`}
            >
              <table className={`f-table ${themeColor}`}>
                <tbody className="f-table-body">{tempArr}</tbody>
              </table>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default StatList;
