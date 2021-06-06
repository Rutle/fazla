import React, { useRef } from 'react';
import PageTemplate from '_/components/PageTemplate';
import ShipDetails from '_/components/ShipDetails';
import { RootState } from '_/reducers/rootReducer';
import { useSelector } from 'react-redux';
import SideBar from './SideBar';
import ShipList from './ShipList';
import RButton from './RButton/RButton';
import { ArrowDegUp } from './Icons';
import useVisibility from './Visibility/useVisibility';

/**
 * Component for a ship details view.
 */
const ShipDetailView: React.FC = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const config = useSelector((state: RootState) => state.config);
  const refData = useRef<HTMLDivElement>(null);
  const refPageContent = useRef<HTMLDivElement>(null);
  const [isVisible, refSide] = useVisibility();

  const scrollTo = (loc: string) => {
    if (loc === 'top' && refSide && refSide.current) {
      refSide.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
    if (loc === 'ship' && refData && refData.current) {
      refData.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
  };

  return (
    <PageTemplate>
      <section className="page-content ships" ref={refPageContent}>
        {appState.cState === 'INIT' ? (
          <div id="ship-details-content" className="container content">
            <div className="info-text">{appState.cMsg}</div>
          </div>
        ) : (
          <>
            <SideBar refer={refSide}>
              <ShipList shipSearchList={shipSearchList} listName="ALL" scrollTo={() => scrollTo('ship')} />
              <ShipList shipSearchList={ownedSearchList} listName="OWNED" scrollTo={() => scrollTo('ship')} />
            </SideBar>
            <div id="side-scroll" className={`button-group ${config.themeColor}${isVisible ? ' small-hidden' : ''}`}>
              <RButton themeColor={config.themeColor} className="btn slide" onClick={() => scrollTo('top')}>
                <ArrowDegUp themeColor={config.themeColor} />
              </RButton>
            </div>

            <div id="ship-details-content" className="container content" ref={refData}>
              <ShipDetails />
            </div>
          </>
        )}
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
