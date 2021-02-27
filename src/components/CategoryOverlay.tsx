import React, { useRef, useState } from 'react';
import Overlay from 'react-overlays/Overlay';
import SearchParameterContent from './SearchParameterContent';

/**
 * Category overlay container for category parameter toggles.
 */
const CategoryOverlay: React.FC<{ themeColor: string; isSmallScreen: boolean }> = ({ themeColor, isSmallScreen }) => {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} ref={containerRef}>
      <button
        ref={triggerRef}
        className={`btn normal ${themeColor}`}
        type="button"
        onClick={() => {
          setIsOverlayOpen(!isOverlayOpen);
        }}
      >
        Categories
      </button>
      <Overlay
        show={isOverlayOpen}
        rootClose
        offset={!isSmallScreen ? [140, 10] : [0, 10]}
        onHide={() => setIsOverlayOpen(false)}
        placement={!isSmallScreen ? 'right' : 'bottom'}
        container={containerRef}
        target={triggerRef}
      >
        {({ props /* arrowProps, placement */ }) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <div className={`popover-container ${themeColor}`} {...props}>
            <SearchParameterContent themeColor={themeColor} />
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default CategoryOverlay;
