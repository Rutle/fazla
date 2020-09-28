/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { History, LocationState } from 'history';
import { RootState } from '../reducers/rootReducer';
import FooterBar from './FooterBar';
import RButton from './RButton/RButton';
import TitleBar from './TitleBar';

const LandingView: React.FC<{ history: History<LocationState> }> = ({ history }) => {
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);

  const renderList = () => {
    return (
      <ul
        style={{
          listStyle: 'none',
          alignSelf: 'flex-end',
          paddingInlineStart: '6px',
          marginBlockEnd: '6px',
        }}
      >
        {Object.keys(appState.initPhases).map((key) => (
          <li
            key={`${key}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <span style={{ marginRight: '15px' }}>{appState.initPhases[key].text}</span>{' '}
            <span>{appState.initPhases[key].isReady ? 'Done' : '----'}</span>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <>
      <TitleBar showMenu={false} />
      <div className={`page ${config.themeColor}`}>
        <section className="page-content">
          <div className="ship-data-container dark">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              {appState.cState === 'RUNNING' ? (
                <>
                  <div className="info-text">Program is ready. Please continue.</div>
                  <RButton
                    themeColor={config.themeColor}
                    onClick={() => {
                      history.push('/shipdetails');
                    }}
                    extraStyle={{ marginTop: '30px', height: '50px', width: '20%' }}
                  >
                    Continue
                  </RButton>
                </>
              ) : (
                <>{renderList()}</>
              )}
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  );
};

export default LandingView;
