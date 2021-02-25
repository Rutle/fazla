// eslint-disable-next-line import/no-extraneous-dependencies
import { DebouncedFunc, throttle } from 'lodash';
import { MutableRefObject, useState, useRef, useEffect } from 'react';
/**
 * Check if an element is in viewport
 * source: https://stackoverflow.com/a/66136947
 * https://stackoverflow.com/a/61719846
 */
export default function useVisibility(
  offset = 0,
  throttleMilliseconds = 100
): [boolean, React.RefObject<HTMLDivElement>] {
  const [isVisible, setIsVisible] = useState(false);
  const currentElement = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const onScroll = throttle(() => {
    if (!currentElement.current) {
      setIsVisible(false);
      return;
    }
    const { top } = currentElement.current.getBoundingClientRect();
    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
  }, throttleMilliseconds) as DebouncedFunc<() => void>;

  useEffect(() => {
    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll, true);
  });

  return [isVisible, currentElement];
}
