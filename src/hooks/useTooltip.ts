import React, { useCallback, useRef, useState } from 'react';
import { Placement } from 'react-overlays/esm/usePopper';

interface TooltipData {
  data: React.ReactNode;
  ref: React.RefObject<HTMLElement>;
  placement: Placement;
}

export interface TooltipHooks {
  show: boolean;
  tooltipData: TooltipData;
  showTooltip: (data: TooltipData) => void;
  hideTooltip: () => void;
}
/**
 * Custom hook for tooltips.
 * @returns TooltipHooks
 */
export const useTooltip = (): TooltipHooks => {
  /* TODO? Maybe add tooltips into a .ts file and get them by ID. */
  const [tooltip, setTooltip] = useState<TooltipData>({
    data: '',
    ref: useRef<HTMLElement>(null),
    placement: 'bottom',
  });
  const [show, setShow] = useState(false);

  const showTooltip = useCallback(
    (data: TooltipData) => {
      setTooltip(data);
      setShow(true);
    },
    [setTooltip]
  );

  const hideTooltip = (): void => setShow(false);

  return { show, tooltipData: tooltip, showTooltip, hideTooltip };
};
