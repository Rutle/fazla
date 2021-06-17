import React, { useRef, useState } from 'react';
import Overlay from 'react-overlays/Overlay';

/**
 * Category overlay container for category parameter toggles.
 */
const CustomOverlay: React.FC<{ themeColor: string; isSmallScreen: boolean; children: React.ReactNode }> = ({
  themeColor,
  isSmallScreen,
  children,
}) => {
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
            {children}
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default CustomOverlay;
