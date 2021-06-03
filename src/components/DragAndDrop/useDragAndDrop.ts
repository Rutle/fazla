import React, { useReducer, useRef, useState } from 'react';

export interface UseDragAndDropFunctions {
  onDrop: (event: React.DragEvent<HTMLElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLElement>) => void;
  onDragStart: (event: React.DragEvent<HTMLElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLElement>) => void;
  onDragEnter: (event: React.DragEvent<HTMLElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLElement>) => void;
}

interface UseDragAndDrop {
  dragFunctions: UseDragAndDropFunctions;
  dragStates: {
    isDragged: boolean;
    isTransferOk: boolean;
  };
  dataTransferArray: string[];
  startKey: string;
}

interface DragAndDropState {
  dropDepth: number;
  inDropZone: boolean;
}

function reducer(
  state: DragAndDropState,
  action: { type: 'setDropDepth'; payload: number } | { type: 'setInDropZone'; payload: boolean }
): DragAndDropState {
  switch (action.type) {
    case 'setDropDepth':
      return { ...state, dropDepth: action.payload };
    case 'setInDropZone':
      return { ...state, inDropZone: action.payload };
    default:
      return state;
  }
}

/**
 * Custom hook for DragAndDrop.
 * @returns DragAndDrop
 */
export const useDragAndDrop = ({
  dataKey,
  classNames = { dragOverClass: 'drag-over', draggedClass: 'dragged', dragOverInvalidClass: 'drag-over-invalid' },
  isValidDropZone,
}: {
  dataKey: string;
  isValidDropZone?: (startKey: string, overKey: string) => boolean;
  classNames?: {
    dragOverClass: string;
    draggedClass: string;
    dragOverInvalidClass: string;
  };
}): UseDragAndDrop => {
  const [dragStates, setDragStates] = useState({ isDragged: false, isTransferOk: false });
  const dataTransferArray = useRef<string[]>([]);
  const startKey = useRef('');
  const [data, dispatch] = useReducer(reducer, { dropDepth: 0, inDropZone: false });

  const onDropCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const start = event.dataTransfer.getData(dataKey);
    const end = event.currentTarget.getAttribute(dataKey) as string;
    event.currentTarget.classList.remove(classNames.dragOverClass);
    dispatch({ type: 'setDropDepth', payload: 0 });
    dispatch({ type: 'setInDropZone', payload: false });
    if (start === end) return;
    dataTransferArray.current = [start, end];
    setDragStates({ ...dragStates, isTransferOk: true });
    startKey.current = '';
  };

  const onDragEndCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    event.currentTarget.classList.remove(classNames.draggedClass);
    setDragStates({ ...dragStates, isDragged: false });
    // if (event.currentTarget.parentElement) event.currentTarget.parentElement.blur();
    if (event.currentTarget) event.currentTarget.blur();
  };

  const onDragStartCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.dataTransfer.clearData();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'move';
    setDragStates({ isDragged: true, isTransferOk: false });
    event.dataTransfer.setData(dataKey, event.currentTarget.getAttribute(dataKey) as string);
    event.currentTarget.classList.add(classNames.draggedClass);
    startKey.current = event.currentTarget.getAttribute(dataKey) as string;
  };

  const onDragOverCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    // if (!data.inDropZone) dispatch({ type: 'setInDropZone', payload: true });
    const sKey = event.dataTransfer.getData(dataKey);
    const oKey = event.currentTarget.getAttribute(dataKey) as string;
    if (isValidDropZone && isValidDropZone(sKey, oKey)) return;
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'none';
  };

  const onDragEnterCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const sKey = event.dataTransfer.getData(dataKey);
    const oKey = event.currentTarget.getAttribute(dataKey) as string;
    dispatch({ type: 'setDropDepth', payload: data.dropDepth + 1 });
    if (isValidDropZone) {
      const isValid = isValidDropZone(sKey, oKey);
      if (isValid && data.dropDepth === 0) {
        if (sKey !== oKey) event.currentTarget.classList.add(classNames.dragOverClass);
      } else if (!isValid && data.dropDepth === 0) {
        event.currentTarget.classList.add(classNames.dragOverInvalidClass);
      }
    }
  };

  const onDragLeaveCb = (event: React.DragEvent<HTMLElement>) => {
    dispatch({ type: 'setDropDepth', payload: data.dropDepth - 1 });
    if (data.dropDepth > 1) return;
    dispatch({ type: 'setInDropZone', payload: false });
    event.currentTarget.classList.remove(classNames.dragOverClass);
    event.currentTarget.classList.remove(classNames.dragOverInvalidClass);
  };

  return {
    dragFunctions: {
      onDrop: onDropCb,
      onDragEnd: onDragEndCb,
      onDragStart: onDragStartCb,
      onDragOver: onDragOverCb,
      onDragEnter: onDragEnterCb,
      onDragLeave: onDragLeaveCb,
    },
    dragStates,
    dataTransferArray: dataTransferArray.current,
    startKey: startKey.current,
  };
};
