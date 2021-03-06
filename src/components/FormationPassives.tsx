/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import useResizeObserver from 'use-resize-observer';
import { Ship } from '_/types/shipTypes';
import PassivesList from './PassivesList';
import { CaretLeft } from './Icons';

interface FormationPassivesProps {
  fleet: Ship[];
  themeColor: string;
  isSelected: boolean;
}

/**
 * Component for displaying passives of ships in a formation.
 */
const FormationPassives: React.FC<FormationPassivesProps> = ({ themeColor, fleet, isSelected }) => {
  const [showMain, setShowMain] = useState(true);
  const [showVanguard, setShowVanguard] = useState(true);
  const [isOpen, setIsOpen] = useState({ main: true, vanguard: true });
  const refMain = useRef<HTMLDivElement>(null);
  const refVanguard = useRef<HTMLDivElement>(null);
  const mainSize = useResizeObserver<HTMLDivElement>({ ref: refMain });
  const vanguardSize = useResizeObserver<HTMLDivElement>({ ref: refVanguard });
  const [newHeight, setNewHeight] = useState<{ mainHeight: number | undefined; vanguardHeight: number | undefined }>({
    mainHeight: undefined,
    vanguardHeight: undefined,
  });

  useEffect(() => {
    if (refMain && refMain.current && mainSize.height !== undefined) {
      if (newHeight.mainHeight && mainSize.height + 100 > newHeight.mainHeight && isOpen.main) {
        // Apply new height when the window is being resized.
        const tempHeight = Array.from(refMain.current.children).reduce<number>(
          (a, c) => a + c.getBoundingClientRect().height,
          0
        );
        setNewHeight({ ...newHeight, mainHeight: tempHeight + 100 });
      } else if (showMain && !isOpen.main) {
        // We have clicked to expand a section with 'showMain'.
        // We calculate the height of the current children, add a bit extra and set the new height.
        // We then finally let it open.
        const tempHeight = Array.from(refMain.current.children).reduce<number>(
          (a, c) => a + c.getBoundingClientRect().height,
          0
        );
        setNewHeight({ ...newHeight, mainHeight: tempHeight + 100 });
        setIsOpen({ ...isOpen, main: true });
      } else if (!showMain && isOpen.main) {
        // We have clicked to collapse a section.
        setIsOpen({ ...isOpen, main: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMain, mainSize.height]);

  useEffect(() => {
    if (refVanguard && refVanguard.current && vanguardSize.height !== undefined) {
      if (newHeight.vanguardHeight && vanguardSize.height + 100 > newHeight.vanguardHeight && isOpen.vanguard) {
        // Apply new height when the window is being resized. Only when the height increases.
        // Can ignore when the height decreases because of max height is being used.
        const tempHeight = Array.from(refVanguard.current.children).reduce<number>(
          (a, c) => a + c.getBoundingClientRect().height,
          0
        );
        setNewHeight({ ...newHeight, mainHeight: tempHeight + 100 });
      } else if (showVanguard && !isOpen.vanguard) {
        const tempHeight = Array.from(refVanguard.current.children).reduce<number>(
          (a, c) => a + c.getBoundingClientRect().height,
          0
        );
        setNewHeight({ ...newHeight, vanguardHeight: tempHeight + 100 });
        setIsOpen({ ...isOpen, vanguard: true });
      } else if (!showVanguard && isOpen.vanguard) {
        setIsOpen({ ...isOpen, vanguard: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVanguard]);

  useEffect(() => {
    const curRefMain = refMain.current;
    const curRefVanguard = refVanguard.current;
    // Set the heights when fleet is selected.
    if (
      curRefMain &&
      curRefVanguard &&
      !mainSize.height &&
      !vanguardSize.height &&
      !newHeight.mainHeight &&
      !newHeight.vanguardHeight &&
      isSelected
    ) {
      const tempMainHeight = Array.from(curRefMain.children).reduce<number>(
        (a, c) => a + c.getBoundingClientRect().height,
        0
      );
      const tempVanguardHeight = Array.from(curRefVanguard.children).reduce<number>(
        (a, c) => a + c.getBoundingClientRect().height,
        0
      );
      setNewHeight({ vanguardHeight: tempVanguardHeight + 100, mainHeight: tempMainHeight + 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);

  const isShip = (position: string) => {
    if (position === 'main') {
      return fleet.slice(0, 3).every((s) => s === undefined);
    }
    if (position === 'vanguard') {
      return fleet.slice(3, 6).every((s) => s === undefined);
    }
    return false;
  };

  const getData = (ship: Ship | undefined) => {
    if (ship) {
      return { optionalName: ship.names.en, skills: ship.skills, hullType: ship.hullType };
    }
    return { optionalName: '', skills: undefined };
  };

  return (
    <div className={`f-grid ${themeColor}`}>
      {!isShip('main') ? (
        <>
          <div
            className="f-row action no-focus-outline"
            onClick={() => {
              setShowMain(!showMain);
            }}
          >
            <div className={`f-icon ${showMain ? '' : 'open'}`}>
              <CaretLeft themeColor={themeColor} />
            </div>
            <div className="f-title">Main</div>
          </div>
          <div
            ref={refMain}
            className={`f-collapsible${showMain ? '' : ' f-collapsed'}`}
            style={isOpen.main ? { maxHeight: newHeight.mainHeight } : { maxHeight: 0 }}
          >
            <div className="f-column">
              <PassivesList {...getData(fleet[0])} />
              <PassivesList {...getData(fleet[1])} />
              <PassivesList {...getData(fleet[2])} />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {!isShip('vanguard') ? (
        <>
          <div className="f-row action" onClick={() => setShowVanguard(!showVanguard)}>
            <div className={`f-icon ${showVanguard ? '' : 'open'}`}>
              <CaretLeft themeColor={themeColor} />
            </div>
            <div className="f-title">Vanguard</div>
          </div>
          <div
            ref={refVanguard}
            className={`f-collapsible ${showVanguard ? '' : 'f-collapsed'}`}
            style={isOpen.vanguard ? { maxHeight: newHeight.vanguardHeight } : { maxHeight: 0 }}
          >
            <PassivesList {...getData(fleet[3])} />
            <PassivesList {...getData(fleet[4])} />
            <PassivesList {...getData(fleet[5])} />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FormationPassives;
