import React, { useEffect, useState } from 'react';
import { levelOrder, statsAbb, levelCategories } from '_/data/categories';
import { isStat, ShipStats } from '_/types/shipTypes';
import RButton from './RButton/RButton';

const StatList: React.FC<{ stats: ShipStats; themeColor: string }> = ({ stats, themeColor }) => {
  const statKeys = Object.keys(stats);
  const orderedKeys = levelOrder.filter((v) => statKeys.includes(v));
  const [selectedStats, setSelectedStats] = useState(0);

  useEffect(() => {
    setSelectedStats(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  const getStatList = (idx: number) => {
    if (idx >= orderedKeys.length) return [];
    const statArr = Object.keys(stats[orderedKeys[idx]]);
    const tempArr = [];
    // Go through array in steps of 4
    for (let i = 0; i < statArr.length; i += 4) {
      const temp = statArr.slice(i, i + 4);
      // Add table rows with data to tempArr
      tempArr.push(
        <tr key={`row-${i + 4}`} className="f-table-row">
          {temp.map((stat) => {
            const len = temp.length;
            if (isStat(stat) && len === 4) {
              return (
                <td key={`row-${stat}`} className="stat-item">{`${statsAbb[stat]}: ${
                  stats[orderedKeys[idx]][stat]
                }`}</td>
              );
            }
            if (isStat(stat) && len < 4 && len >= 1) {
              return (
                <React.Fragment key={`${orderedKeys[idx]}-${stat}`}>
                  <td className="stat-item">{`${statsAbb[stat]}: ${stats[orderedKeys[idx]][stat]}`}</td>
                  <td colSpan={4 - len} className="stat-item filler" />
                </React.Fragment>
              );
            }
            return <></>;
          })}
        </tr>
      );
    }
    return tempArr;
  };
  return (
    <>
      <div className={`f-row ${themeColor}`}>
        <div className="f-header">Stats</div>
        <div className="f-header tab-group">
          {stats ? (
            orderedKeys.map((cat, index) => (
              <RButton
                key={`btn-${cat}`}
                themeColor={themeColor}
                className={`tab-btn normal${selectedStats === index ? ' selected' : ''}`}
                onClick={() => setSelectedStats(index)}
              >
                <span style={{ display: 'inline-block' }}>{levelCategories[cat]}</span>
              </RButton>
            ))
          ) : (
            <React.Fragment key="statlist" />
          )}
        </div>
      </div>
      {stats ? (
        <div key="stats" className={`f-body ${themeColor}`}>
          <table className={`f-table ${themeColor}`}>
            <tbody className="f-table-body">{getStatList(selectedStats)}</tbody>
          </table>
        </div>
      ) : (
        /*
        orderedKeys.map((key, idx) => {
          // Grab stats of a stat catergory
          console.log('ddd');
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
          return ( */

        // );
        // })
        <></>
      )}
    </>
  );
};

export default StatList;
