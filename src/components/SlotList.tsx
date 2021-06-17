import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '_/App';
import { Slot } from '_/types/shipTypes';
import { ParsedValues, parseSlots } from '_/utils/appUtilities';
import RButton from './RButton/RButton';
import TooltipWrapper from './Tooltip/TooltipWrapper';

const slotTabs = ['Base', 'Retrofit', '?'];

const EqList: React.FC<{ list?: string[][]; headers?: string[]; themeColor: string }> = ({
  list = [],
  headers = [],
  themeColor,
}) => {
  return (
    <div className={`f-grid ${themeColor}`} style={{ marginBottom: '0px' }}>
      {headers ? (
        <>
          {headers.map((val, idx) => (
            <React.Fragment key={val}>
              <div className="f-header" style={{ fontSize: '12px' }}>
                {val}
              </div>
              <div className="f-column f-body" style={{ padding: '1px 5px 1px 5px', borderBottom: 'unset' }}>
                {list ? (
                  list[idx].map((e) => (
                    <div className="eq-item" key={e} style={{ display: 'flex', fontSize: '11px' }}>
                      {e}
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </React.Fragment>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>

    /* 
    <dl style={{ listStylePosition: 'outside', marginBlock: '1px', padding: '2px 2px 2px 2px', listStyle: 'none' }}>
      {list.map((eq) => (
        <li>{eq}</li>
      ))}
    </dl>
  */
  );
};

/*
  <dl>
    <dt>Add ship</dt>
    <dd>Left mouse click to select.</dd>
    <dt>Remove ship</dt>
    <dd>Right mouse click to remove.</dd>
    <dt>Drag</dt>
    <dd>Drag and drop ships.</dd>
  </dl>
*/
const SlotList: React.FC<{ slots: { [key: string]: Slot }; hasRetrofit?: boolean; themeColor: string }> = React.memo(
  ({ slots, hasRetrofit, themeColor }) => {
    const { shipData } = useContext(AppContext);
    const [selectedSlotList, setSelectedSlotList] = useState(0);
    const [parsedData, setParsedSlots] = useState<ParsedValues>({ parsedFits: [], parsedSlots: [] });

    useEffect(() => {
      setParsedSlots(parseSlots(slots, shipData));
      setSelectedSlotList(0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slots]);

    return (
      <>
        <div className={`f-row ${themeColor}`}>
          <div className="f-header">Equipment</div>
          {hasRetrofit && parsedData.parsedSlots.length > 1 ? (
            <div className="f-header tab-group">
              {parsedData.parsedSlots.map((cat, index) => (
                <RButton
                  key={`btn-${slotTabs[index]}`}
                  themeColor={themeColor}
                  className={`tab-btn normal${selectedSlotList === index ? ' selected' : ''}`}
                  onClick={() => setSelectedSlotList(index)}
                >
                  {slotTabs[index]}
                </RButton>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
        {slots && parsedData.parsedSlots ? ( // [{1:[], 2:[], 3:[] }, {1:[], 2:[], 3:[] }]
          parsedData.parsedSlots.map((e, idx) => {
            const t = Object.values(e);
            const tempArr = [];
            for (let i = 0; i < t.length; i += 1) {
              tempArr.push(
                <div key={`slot-${t.length * i}`} className="grid-item slot">
                  {t[i].map((eq) => (
                    <React.Fragment key={`${eq}`}>{`${eq}\n`}</React.Fragment>
                  ))}
                </div>
                /*
                <TooltipWrapper
                  key={`slot-${t.length * i}`}
                  wrapperClassNames="grid-item slot"
                  WrapperElement="div"
                  data={
                    <EqList list={parsedData.parsedFits[idx][i.toString()]} headers={t[i]} themeColor={themeColor} />
                  }
                  placement="auto"
                >
                  {t[i].map((eq) => (
                    <React.Fragment key={`${eq}`}>{`${eq}\n`}</React.Fragment>
                  ))}
                </TooltipWrapper> */
              );
            }
            return (
              <div
                key={`div-${t.length * idx}`}
                className={`f-row f-body slots wrap ${themeColor}${selectedSlotList !== idx ? ' hidden' : ''}`}
              >
                {tempArr}
              </div>
            );
          })
        ) : (
          <></>
        )}
      </>
    );
  }
);

export default SlotList;
