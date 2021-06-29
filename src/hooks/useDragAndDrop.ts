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
  transferData: { start: { [key: string]: string }; end: { [key: string]: string } };
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
  dataKeys = [],
  baseKey,
  overKey,
  classNames = { dragOverClass: 'drag-over', draggedClass: 'dragged', dragOverInvalidClass: 'drag-over-invalid' },
  isValidDropZone,
}: {
  dataKeys: string[];
  baseKey: string;
  overKey: string;
  isValidDropZone?: (sKey: string, oKey: string) => boolean;
  classNames?: {
    dragOverClass: string;
    draggedClass: string;
    dragOverInvalidClass: string;
  };
}): UseDragAndDrop => {
  const [dragStates, setDragStates] = useState({ isDragged: false, isTransferOk: false });
  const dataRef = useRef<{ start: { [key: string]: string }; end: { [key: string]: string } }>({
    start: {},
    end: {},
  });
  const [data, dispatch] = useReducer(reducer, { dropDepth: 0, inDropZone: false });

  const onDropCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const start = JSON.parse(event.dataTransfer.getData(baseKey)) as { [key: string]: string };
    const end = dataKeys.reduce(
      (a, c) => Object.assign(a, { [c]: event.currentTarget.getAttribute(c) }),
      {} as { [key: string]: string }
    );
    event.currentTarget.classList.remove(classNames.dragOverClass);
    dispatch({ type: 'setDropDepth', payload: 0 });
    dispatch({ type: 'setInDropZone', payload: false });
    dataRef.current = { start, end };
    setDragStates({ ...dragStates, isTransferOk: true });
  };

  const onDragEndCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    event.currentTarget.classList.remove(classNames.draggedClass);
    setDragStates({ ...dragStates, isDragged: false });
    if (event.currentTarget.parentElement) event.currentTarget.parentElement.blur();
    if (event.currentTarget) event.currentTarget.blur();
  };

  const onDragStartCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.dataTransfer.clearData();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'move';
    setDragStates({ isDragged: true, isTransferOk: false });
    const obj = dataKeys.reduce((acc, cur) => {
      acc[cur] = event.currentTarget.getAttribute(cur) as string;
      return acc;
    }, {} as { [key: string]: string });
    event.dataTransfer.setData(baseKey, JSON.stringify(obj));
    event.currentTarget.classList.add(classNames.draggedClass);
  };

  const onDragOverCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!data.inDropZone) dispatch({ type: 'setInDropZone', payload: true });
    const oKey = event.currentTarget.getAttribute(overKey) as string;
    const sKey = event.dataTransfer.types[0];
    // console.log('types', event.dataTransfer.types, '[oKey]', oKey, 'sKey', sKey, 'baseKey', baseKey, 'overKey', overKey);
    if (isValidDropZone && isValidDropZone(sKey, oKey)) return;
    // console.log('dragover none');
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'none';
  };

  const onDragEnterCb = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const sKey = event.dataTransfer.types[0];
    const oKey = event.currentTarget.getAttribute(overKey) as string;
    dispatch({ type: 'setDropDepth', payload: data.dropDepth + 1 });
    // console.log(event.dataTransfer.types);
    // console.log('onDragEnter sKey:', sKey, 'oKey', oKey, 'baseKey', baseKey);
    if (isValidDropZone) {
      const isValid = isValidDropZone(sKey, oKey);
      if (isValid && data.dropDepth === 0) {
        if (sKey === oKey) event.currentTarget.classList.add(classNames.dragOverClass);
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
    transferData: dataRef.current,
  };
};
