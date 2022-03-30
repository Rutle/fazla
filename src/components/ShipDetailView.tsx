import React, { useEffect, useRef } from 'react';
import PageTemplate from '_/components/PageTemplate';
import ShipDetails from '_/components/ShipDetails';
import { RootState } from '_/reducers/rootReducer';
import { useSelector } from 'react-redux';
import SideBar from './SideBar';
import ShipList from './ShipList';
import RButton from './RButton/RButton';
import { ArrowDegUp } from './Icons';
import useVisibility from '../hooks/useVisibility';

/**
 * Component for a ship details view.
 */
const ShipDetailView: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const appState = useSelector((state: RootState) => state.appState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const searchParams = useSelector((state: RootState) => state.searchParameters);
  const config = useSelector((state: RootState) => state.config);
  const refData = useRef<HTMLDivElement>(null);
  // const refPageContent = useRef<HTMLDivElement>(null);
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
      <div id="ships" className="scroll container content">
        {appState.cState === 'INIT' ? (
          <div id="ship-details-content">
            <div style={{ display: 'flex', height: '100%', justifyContent: 'center' }}>
              <div
                className={`message-container ${config.themeColor}`}
                style={{
                  alignSelf: 'center',
                  width: '50%',
                  minHeight: '40px',
                }}
              >
                <span className="message" style={{ fontSize: '24px', justifyContent: 'center' }}>
                  {appState.cState}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <SideBar refer={refSide}>
              <ShipList shipSearchList={shipSearchList} listName="ALL" scrollTo={() => scrollTo('ship')} />
              <ShipList shipSearchList={ownedSearchList} listName="OWNED" scrollTo={() => scrollTo('ship')} />
            </SideBar>
            <div id="small-nav" className={`navigation ${config.themeColor}${isVisible ? ' small-hidden' : ''}`}>
              <RButton
                themeColor={config.themeColor}
                className="nav-item"
                onClick={() => scrollTo('top')}
                extraStyle={{ display: 'flex', padding: '6px', marginTop: '4px', borderRadius: 'inherit' }}
              >
                <ArrowDegUp themeColor={config.themeColor} />
              </RButton>
            </div>

            <div id="ship-details-content" ref={refData}>
              <ShipDetails />
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default ShipDetailView;
