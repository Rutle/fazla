import React, { useRef, useState } from 'react';
import Overlay from 'react-overlays/Overlay';
import SearchParameterContent from './SearchParameterContent';

const CategoryOverlay: React.FC = () => {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} ref={containerRef}>
      <button
        ref={triggerRef}
        className={`btn small graphic dark ${isOverlayOpen ? 'selected' : ''}`}
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
          <div className="popover-container dark" {...props}>
            <SearchParameterContent />
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default CategoryOverlay;
