/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useEffect, useRef, useState } from 'react';
import PageTemplate from '_/components/PageTemplate';
import ShipDetails from '_/components/ShipDetails';
import { RootState } from '_/reducers/rootReducer';
import { useSelector } from 'react-redux';
import useRootClose from 'react-overlays/useRootClose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSTransition } from 'react-transition-group';
import SideBar from './SideBar';
import ShipList from './ShipList';
import { ListIcon } from './Icons';

/**
 * Component for a ship details view.
 */
const ShipDetailView: React.FC = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const config = useSelector((state: RootState) => state.config);
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const handleRootClose = () => setShow(false);

  useRootClose(ref, handleRootClose, {
    disabled: !show,
  });
  return (
    <PageTemplate>
      <section className="page-content">
        {appState.cState === 'INIT' ? (
          <div id="ship-details-content" className="ship-data-container">
            <div className="info-text">{appState.cMsg}</div>
          </div>
        ) : (
          <>
            <CSSTransition nodeRef={ref} in={show} timeout={600} classNames="side-slide">
              <SideBar refe={ref}>
                <ShipList shipSearchList={shipSearchList} listName="ALL" />
                <ShipList shipSearchList={ownedSearchList} listName="OWNED" />
              </SideBar>
            </CSSTransition>
            <div role="button" id="sidebar-slider" onClick={() => setShow(true)}>
              <ListIcon themeColor={config.themeColor} />
            </div>
            <div className="ship-data-container">
              <ShipDetails />
            </div>
          </>
        )}
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
