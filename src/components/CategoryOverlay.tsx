import React, { useRef, useState } from 'react';
import Overlay from 'react-overlays/Overlay';
import DataStore from '../util/dataStore';
import SearchParameterContent from './SearchParameterContent';
import PropTypes from 'prop-types';

const CategoryOverlay: React.FC<{ shipData: DataStore; themeColor: string }> = ({ shipData, themeColor }) => {
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
        /* containerPadding={20}*/
        offset={[0, 10]}
        onHide={() => setIsOverlayOpen(false)}
        placement={'bottom'}
        container={containerRef}
        target={triggerRef}
      >
        {({ props /* arrowProps, placement */ }) => (
          // eslint-disable-next-line react/prop-types
          <div className={`popover-container ${themeColor}`} {...props}>
            <SearchParameterContent shipData={shipData} themeColor={themeColor} />
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default CategoryOverlay;

CategoryOverlay.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
