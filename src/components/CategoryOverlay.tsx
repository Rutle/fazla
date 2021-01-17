import React, { useRef, useState } from 'react';
import Overlay from 'react-overlays/Overlay';
import PropTypes from 'prop-types';
import SearchParameterContent from './SearchParameterContent';

/**
 * Category overlay container for category parameter toggles.
 */
const CategoryOverlay: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} ref={containerRef}>
      <button
        ref={triggerRef}
        className={`btn small graphic ${themeColor}`}
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
        offset={[0, 10]}
        onHide={() => setIsOverlayOpen(false)}
        placement="bottom"
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

CategoryOverlay.propTypes = {
  themeColor: PropTypes.string.isRequired,
};
