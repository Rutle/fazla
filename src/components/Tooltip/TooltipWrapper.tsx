import React, { useContext, useRef } from 'react';
import { AppContext } from '_/App';

interface TooltipProps {
  children: React.ReactNode;
  data: React.ReactNode;
  WrapperElement?: 'div' | 'span' | 'label' | 'button';
  wrapperClassNames?: string;
  extraProps?: { [key: string]: any };
}
/**
 * Tooltip wrapper.
 */
const TooltipWrapper: React.FC<TooltipProps> = React.memo(
  ({ data, children, wrapperClassNames = '', WrapperElement = 'div', extraProps = {} }) => {
    const { showTooltip, hideTooltip } = useContext(AppContext).tooltip;
    const ref = useRef(null);
    return (
      <WrapperElement
        ref={ref}
        className={wrapperClassNames}
        onMouseEnter={() => {
          showTooltip({ data, ref });
        }}
        onMouseLeave={() => {
          hideTooltip();
        }}
        {...extraProps}
      >
        {children}
      </WrapperElement>
    );
  }
);

export default TooltipWrapper;
