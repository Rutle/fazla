import React, { useState } from 'react';
import { Placement } from 'react-overlays/cjs/usePopper';
import TooltipWrapper from '../Tooltip/TooltipWrapper';

interface RToggleProps {
  id: string;
  value: string;
  className?: string;
  children: React.ReactNode;
  themeColor: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  selected: boolean;
  extraStyle?: React.CSSProperties;
  tooltip?: { data: React.ReactNode };
}

const RToggle: React.FC<RToggleProps> = React.memo(
  ({ id, value, className = 'btn normal', children, themeColor, onChange, selected, extraStyle, tooltip }) => {
    const [isFocusOutline, setFocusOutline] = useState(false);

    const withTooltip = (child: React.ReactElement) => {
      if (!tooltip) {
        return (
          <label
            className={`${className} ${themeColor}${selected ? ' selected' : ''} ${
              !isFocusOutline ? 'no-focus-outline' : ''
            }`}
            htmlFor={`${id}-input`}
            style={extraStyle}
          >
            <span style={{ display: 'inline-block' }}>{child}</span>
          </label>
        );
      }
      return (
        <TooltipWrapper
          data={tooltip.data}
          wrapperClassNames={`${className} ${themeColor}${selected ? ' selected' : ''} ${
            !isFocusOutline ? 'no-focus-outline' : ''
          }`}
          WrapperElement="label"
          extraProps={{
            htmlFor: `${id}-input`,
            style: extraStyle,
          }}
        >
          <span style={{ display: 'inline-block' }}>{child}</span>
        </TooltipWrapper>
      );
    };
    return (
      <>
        {withTooltip(
          <>
            {children}
            <input
              id={`${id}-input`}
              value={value}
              type="radio"
              checked={selected}
              onChange={onChange}
              onClick={(e) => {
                const { clientX, clientY } = e;
                if (clientX !== 0 && clientY !== 0) {
                  setFocusOutline(false);
                } else {
                  setFocusOutline(true);
                }
              }}
              onKeyUp={(e) => {
                if (e.key === 'Tab' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  setFocusOutline(true);
                }
              }}
            />
          </>
        )}
      </>
    );
    /*
    return (
      <label
        className={`${className} ${themeColor}${selected ? ' selected' : ''} ${
          !isFocusOutline ? 'no-focus-outline' : ''
        }`}
        htmlFor={`${id}-input`}
        style={extraStyle}
      >
        {children}
        <input
          id={`${id}-input`}
          value={value}
          type="radio"
          checked={selected}
          onChange={onChange}
          onClick={(e) => {
            const { clientX, clientY } = e;
            if (clientX !== 0 && clientY !== 0) {
              setFocusOutline(false);
            } else {
              setFocusOutline(true);
            }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Tab' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              setFocusOutline(true);
            }
          }}
        />
      </label>
    ); */
  }
);

export default RToggle;
