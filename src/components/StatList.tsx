import React, { useEffect, useState } from 'react';
import { statCatAbb, statsAbb, statCatAbbOrder } from '_/data/categories';
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
            statCatAbbOrder.map((cat, index) =>
              statKeys.includes(cat) ? (
                <RButton
                  key={`btn-${cat}`}
                  themeColor={themeColor}
                  className={`tab-btn normal${selectedStats === index ? ' selected' : ''}`}
                  onClick={() => setSelectedStats(index)}
                >
                  <span style={{ display: 'inline-block' }}>{statCatAbb[cat]}</span>
                </RButton>
              ) : (
                <React.Fragment key={`btn-${cat}`} />
              )
            )
          ) : (
            <React.Fragment key="statlist" />
          )}
        </div>
      </div>
      {stats ? (
        statCatAbbOrder.map((key, idx) => {
          if (!statKeys.includes(key)) return <></>;
          // Grab stats of a stat catergory
          const statArr = Object.keys(stats[key]);
          const tempArr = [];
          // Go through array in steps of 4
          for (let i = 0; i < statArr.length; i += 4) {
            const temp = statArr.slice(i, i + 4);
            // Add table rows with data to tempArr
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
            <div key={`div-${key}`} className={`f-body ${themeColor} ${selectedStats !== idx ? 'hidden' : ''}`}>
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
