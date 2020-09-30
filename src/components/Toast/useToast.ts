import { useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { removeToastByIndex } from '../../reducers/slices/toastSlice';

export type CallbackDismiss = () => void;

type ToastMessage = {
  type: 'warning' | 'error' | 'info';
  label: string;
  msg: string;
  id: number;
  isCallback: boolean;
  callback?: CallbackDismiss;
};

export type DismissFunctionList = ToastMessage[];

function reducer(
  state: DismissFunctionList,
  action: { type: 'add'; payload: ToastMessage } | { type: 'remove'; index: number } | { type: 'pop' },
): DismissFunctionList {
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

export const useToast = (): [
  (type: 'warning' | 'info' | 'error', label: string, msg: string, onDismiss?: CallbackDismiss) => void,
  (id: number) => void,
  () => void,
  DismissFunctionList,
] => {
  const dispatch = useDispatch();
  const [toasts, dismissFunctionAction] = useReducer(reducer, []);

  const addToast = (type: 'warning' | 'info' | 'error', label: string, msg: string, onDismiss?: CallbackDismiss) => {
    const id = Date.now();
    dismissFunctionAction({
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

  const onToastDismiss = (id: number) => {
    const toastIndex = toasts.findIndex((cb) => cb.id === id);
    if (toasts[toastIndex].callback) {
      const func = toasts[toastIndex].callback;
      if (func) func();
    }
    dispatch(removeToastByIndex(toastIndex));
  };

  const popToast = () => {
    const toast = toasts[0];
    if (toast.callback) {
      const func = toast.callback;
      if (func) func();
    }
    dismissFunctionAction({ type: 'pop' });
  };
  return [addToast, onToastDismiss, popToast, toasts];
};
