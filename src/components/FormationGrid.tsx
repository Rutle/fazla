import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import { FormationModalAction, formationModalAction } from '_/reducers/slices/formationModalSlice';
import { Ship } from '_/types/types';
import DataStore from '_/utils/dataStore';
import FormationGridItem from './FormationGridItem';

interface FormationGridProps {
  themeColor: string;
  // children: React.ReactNode;
  // isTitle: boolean;
  selectedIndex: number;
  ships: Ship[][];
  openModal: React.Dispatch<
    React.SetStateAction<{
      modal: string;
      isOpen: boolean;
    }>
  >;
  shipData: DataStore;
}

/**
 * Component presenting ships in a grid.
 */
const FormationGrid: React.FC<FormationGridProps> = ({ themeColor, selectedIndex, ships, openModal, shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);

  const open = useCallback(
    (action: FormationModalAction, toggle: 'ALL' | 'OWNED', index: number, data: DataStore) => () => {
      dispatch(formationModalAction(action, toggle, index, data));
      openModal({ modal: 'shiplist', isOpen: true });
    },
    [dispatch, openModal]
  );
  return (
    <div className={`f-grid ${themeColor}`}>
      <div className="f-row wrap">
        <div id="main-section" className="f-column">
          <div className="f-title">Main</div>
          {ships.map((fleet, idx) => (
            <div key={`main-${idx * fleet.length}`} className={`f-row ${selectedIndex === idx ? '' : 'small-hidden'}`}>
              {fleet.slice(0, 3).map((ship, idxx) => (
                <FormationGridItem
                  key={`main-${idx * 6 + idxx}`}
                  index={idx * 6 + idxx}
                  ship={ship}
                  themeColor={themeColor}
                  onClick={open(FormationModalAction.Open, appState.cToggle, idx * 6 + idxx, shipData)}
                />
              ))}
            </div>
          ))}
        </div>
        <div id="vanguard-secton" className="f-column">
          <div className="f-title">Vanguard</div>
          {ships.map((fleet, idx) => (
            <div
              key={`vanguard-${idx * fleet.length}`}
              className={`f-row ${selectedIndex === idx ? '' : 'small-hidden'}`}
            >
              {fleet.slice(3).map((ship, idxx) => (
                <FormationGridItem
                  key={`van-${idx * 6 + (idxx + 3)}`}
                  index={idx * 6 + (idxx + 3)}
                  ship={ship}
                  themeColor={themeColor}
                  onClick={open(FormationModalAction.Open, appState.cToggle, idx * 6 + (idxx + 3), shipData)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormationGrid;
