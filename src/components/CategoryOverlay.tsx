import React, { /*useContext,*/ useRef, useState } from 'react';
import Overlay from 'react-overlays/Overlay';
import SearchParameterContent from './SearchParameterContent';
import PropTypes from 'prop-types';
// import { AppContext } from '../App';
/**
 * Category overlay container for category parameter toggles.
 */
const CategoryOverlay: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  // const { addToast } = useContext(AppContext);

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} ref={containerRef}>
      <button
        ref={triggerRef}
        className={`btn small graphic ${themeColor}`}
        type="button"
        onClick={() => {
          setIsOverlayOpen(!isOverlayOpen);
          // if (config.isToast) addToast('warning', 'cat', 'testi', () => console.log('add2'));
        }}
      >
        Categories
      </button>
      <Overlay
        show={isOverlayOpen}
        rootClose
        /* containerPadding={20}*/
        offset={[0, 10]}
        onHide={() => setIsOverlayOpen(false)}
        placement={'bottom'}
        container={containerRef}
        target={triggerRef}
      >
        {({ props /* arrowProps, placement */ }) => (
          <div className={`popover-container ${themeColor}`} {...props}>
            <SearchParameterContent themeColor={themeColor} />
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default CategoryOverlay;

CategoryOverlay.propTypes = {
  themeColor: PropTypes.string.isRequired,
};
