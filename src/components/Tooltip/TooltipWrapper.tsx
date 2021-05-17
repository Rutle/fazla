import React, { useContext, useRef } from 'react';
import { Placement } from 'react-overlays/cjs/usePopper';
import { AppContext } from '_/App';

interface TooltipProps {
  children: React.ReactNode;
  data: React.ReactNode;
  WrapperElement?: 'div' | 'span' | 'label' | 'button';
  wrapperClassNames: string;
  placement: Placement;
  extraProps?: { [key: string]: any };
}
/**
 * Tooltip wrapper.
 */
const TooltipWrapper: React.FC<TooltipProps> = ({
  data,
  children,
  wrapperClassNames,
  WrapperElement = 'div',
  placement,
  extraProps = {},
}) => {
  const { showTooltip, hideTooltip } = useContext(AppContext).tooltip;
  const ref = useRef(null);
  return (
    <WrapperElement
      ref={ref}
      className={wrapperClassNames}
      onMouseEnter={() => {
        showTooltip({ data, ref, placement });
      }}
      onMouseLeave={() => {
        hideTooltip();
      }}
      {...extraProps}
    >
      {children}
    </WrapperElement>
  );
};

export default TooltipWrapper;
