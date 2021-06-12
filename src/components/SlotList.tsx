import React, { useCallback, useState } from 'react';
import { Slot } from '_/types/shipTypes';
import { parseSlots } from '_/utils/appUtilities';
import RButton from './RButton/RButton';

const slotTabs = ['Base', 'Retrofit', '?'];

const SlotList: React.FC<{ slots: { [key: string]: Slot }; hasRetrofit?: boolean; themeColor: string }> = ({
  slots,
  hasRetrofit,
  themeColor,
}) => {
  const parsedSlots = parseSlots(slots, hasRetrofit);
  const [selectedSlotList, setSelectedSlotList] = useState(0);

  const selectSlots = useCallback(
    (index: number) => () => {
      setSelectedSlotList(index);
    },
    []
  );
  return (
    <>
      <div className={`f-row ${themeColor}`}>
        <div className="f-header">Equipment</div>

        {hasRetrofit && parsedSlots.length > 1 ? (
          <div className="f-header tab-group">
            {parsedSlots.map((cat, index) => (
              <RButton
                key={`btn-${slotTabs[index]}`}
                themeColor={themeColor}
                className={`tab-btn normal${selectedSlotList === index ? ' selected' : ''}`}
                onClick={selectSlots(index)}
              >
                {slotTabs[index]}
              </RButton>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
      {slots && parsedSlots ? ( // [{1:[], 2:[], 3:[] }, {1:[], 2:[], 3:[] }]
        parsedSlots.map((e, idx) => {
          const t = Object.values(e);
          const tempArr = [];
          for (let i = 0; i < t.length; i += 1) {
            tempArr.push(
              <div key={`slot-${t.length * i}`} className="grid-item slot">
                {t[i].map((eq) => (
                  <React.Fragment key={`${eq}`}>{`${eq}\n`}</React.Fragment>
                ))}
              </div>
            );
          }
          return (
            <div
              key={`div-${t.length * idx}`}
              className={`f-row f-body ${themeColor} ${selectedSlotList !== idx ? 'hidden' : ''}`}
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
};

export default SlotList;
