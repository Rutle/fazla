import React, { useEffect, useContext, useRef, useState } from 'react';
import Overlay from 'react-overlays/Overlay';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '_/App';
import { RootState } from '_/reducers/rootReducer';
import { resetToggles, SearchAction, updateSearch } from '_/reducers/slices/searchParametersSlice';
import RButton from './RButton/RButton';

/**
 * Category overlay container for category parameter toggles.
 */
const CustomOverlay: React.FC<{ themeColor: string; isSmallScreen: boolean; children: React.ReactNode }> = ({
  themeColor,
  isSmallScreen,
  children,
}) => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    if (!(searchParameters.hullType.All && searchParameters.nationality.All && searchParameters.rarity.All)) {
      setIsToggled(true);
    } else if (isToggled) {
      setIsToggled(false);
      // if (isOverlayOpen && btnRef && btnRef.current) btnRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters.hullType, searchParameters.nationality, searchParameters.rarity]);
  return (
    <>
      <div
        style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}
        ref={containerRef}
        id="categories"
        className={`button-group rounded ${themeColor}`}
      >
        <button
          ref={btnRef}
          className={`btn normal ${themeColor}`}
          type="button"
          onClick={() => {
            setIsOverlayOpen(!isOverlayOpen);
          }}
          style={{ flexGrow: 1 }}
        >
          <span style={{ display: 'inline-block' }}>Categories</span>
        </button>
        <Overlay
          show={isOverlayOpen}
          rootClose
          offset={!isSmallScreen ? [140, 10] : [0, 10]}
          onHide={() => setIsOverlayOpen(false)}
          placement={!isSmallScreen ? 'right' : 'bottom'}
          container={containerRef}
          target={containerRef}
        >
          {({ props /* arrowProps, placement */ }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <div className={`popover-container ${themeColor}`} {...props}>
              {children}
            </div>
          )}
        </Overlay>
        <RButton
          className={`btn normal ${themeColor} ${isToggled ? 'selected' : ''}`}
          extraStyle={{ flexGrow: 1 }}
          disabled={!isToggled}
          onClick={() => {
            dispatch(resetToggles());
            dispatch(updateSearch(shipData, SearchAction.UpdateList));
          }}
        >
          <span style={{ display: 'inline-block' }}>Reset</span>
        </RButton>
      </div>
    </>
  );
};

export default CustomOverlay;
