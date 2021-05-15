import React, { useContext, useRef } from 'react';
import { Placement } from 'react-overlays/cjs/usePopper';
import { AppContext } from '_/App';

interface TooltipProps {
  children: React.ReactNode;
  data: React.ReactNode;
  wrapperElement: string;
  wrapperClassNames: string;
  placement: Placement;
}
/**
 * Tooltip wrapper.
 */
const TooltipWrapper: React.FC<TooltipProps> = ({ data, children, wrapperClassNames, wrapperElement, placement }) => {
  const { showTooltip, hideTooltip } = useContext(AppContext).tooltip;
  const ref = useRef(null);

  const wrapper = (child: React.ReactNode, wrapperProps: unknown) => {
    if (wrapperElement === 'div') return <div {...wrapperProps}>{child}</div>;
    if (wrapperElement === 'span') return <span {...wrapperProps}>{child}</span>;
    return <></>;
  };

  return (
    <>
      {wrapper(children, {
        ref,
        className: wrapperClassNames,
        onMouseEnter: () => {
          showTooltip({ data, ref, placement });
        },
        onMouseLeave: () => {
          hideTooltip();
        },
      })}
    </>
  );
};

export default TooltipWrapper;
