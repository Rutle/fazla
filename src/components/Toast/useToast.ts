import { useCallback, useEffect, useReducer, useRef } from 'react';

export type CallbackDismiss = () => void;

type ToastMessage = {
  type: 'warning' | 'error' | 'info';
  label: string;
  msg: string;
  id: number;
  isCallback: boolean;
  callback?: CallbackDismiss;
};

export type ToastList = ToastMessage[];

function reducer(
  state: ToastList,
  action: { type: 'add'; payload: ToastMessage } | { type: 'remove'; index: number } | { type: 'pop' },
): ToastList {
  switch (action.type) {
    case 'add':
      return [...state, { ...action.payload }];
    case 'remove': {
      return [...state.filter((_value, index) => index !== action.index)];
    }
    case 'pop': {
      const newArr = [...state.slice(1)];
      return newArr;
    }
    default:
      throw new Error();
  }
}

export const useToast = (
  autoDismiss: boolean,
  timeout: number,
): [
  (type: 'warning' | 'info' | 'error', label: string, msg: string, onDismiss?: CallbackDismiss) => void,
  (id: number) => void,
  () => void,
  ToastList,
] => {
  const [toasts, toastAction] = useReducer(reducer, []);
  const intervalRef = useRef<number>();

  const onToastDismiss = useCallback(
    (id: number) => {
      const toastIndex = toasts.findIndex((cb) => cb.id === id);
      if (toasts[toastIndex].callback) {
        const func = toasts[toastIndex].callback;
        if (func) func();
      }
      toastAction({ type: 'remove', index: toastIndex });
    },
    [toasts],
  );

  const popToast = useCallback(() => {
    const toast = toasts[0];
    if (toast.callback) {
      const func = toast.callback;
      if (func) func();
    }
    toastAction({ type: 'pop' });
  }, [toasts]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (autoDismiss && toasts.length) {
        if (toasts[0].isCallback) {
          onToastDismiss(toasts[0].id);
        }
        popToast();
      }
    }, timeout);
    intervalRef.current = interval;
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [toasts, autoDismiss, onToastDismiss, timeout, popToast]);

  const addToast = (type: 'warning' | 'info' | 'error', label: string, msg: string, onDismiss?: CallbackDismiss) => {
    const id = Date.now();
    toastAction({
      type: 'add',
      payload: {
        id: id,
        type: type,
        label: label,
        msg: msg,
        isCallback: onDismiss ? true : false,
        callback: onDismiss ? onDismiss : undefined,
      },
    });
  };

  return [addToast, onToastDismiss, popToast, toasts];
};
