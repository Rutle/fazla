import React, { useContext, useRef } from 'react';
import { Overlay } from 'react-overlays';
import { useSelector } from 'react-redux';
import { AppContext } from '_/App';
import { RootState } from '_/reducers/rootReducer';

const Tooltip: React.FC = () => {
  const { tooltipData, show, hideTooltip } = useContext(AppContext).tooltip;
  const containerRef = useRef(null);
  const config = useSelector((state: RootState) => state.config);

  return (
    <div id="tooltip-container" ref={containerRef}>
      <Overlay
        show={show}
        rootClose
        offset={[0, 12]}
        onHide={() => hideTooltip()}
        placement={tooltipData.placement}
        container={containerRef}
        target={tooltipData.ref}
        popperConfig={{
          modifiers: [
            {
              name: 'arrow',
              options: {
                padding: 1, // 5px from the edges of the popper
              },
            },
          ],
        }}
      >
        {({ props, arrowProps, placement }) => (
          <div className={`tooltip ${config.themeColor}`} {...props}>
            <div {...arrowProps} className={`tooltip-arrow ${placement}`} />
            <div className="tooltip-content dark">{tooltipData.data}</div>
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default Tooltip;
