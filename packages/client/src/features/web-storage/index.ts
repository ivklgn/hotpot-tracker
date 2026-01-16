import { useState } from 'react';
import { PersistentStorage, localStorageWrapper, sessionStorageWrapper } from './storage';
import { useEvent } from '../../hooks/useEvent';
import { isFunction } from '../../utils/function';

function createPersistentStateHooks(storage: PersistentStorage) {
  return function usePersistentState<Value>(name: string, initialValue: (() => Value) | Value) {
    const [value, setValue] = useState(() => {
      if (storage.has(name)) {
        return storage.get(name) as Value;
      }

      return isFunction(initialValue) ? initialValue() : initialValue;
    });

    const setState = useEvent((newValue: React.SetStateAction<Value>) => {
      const actualNewValue = isFunction(newValue) ? newValue(value) : newValue;

      storage.set(name, actualNewValue);

      setValue(actualNewValue);
    });

    return [value, setState] as const;
  };
}

export const useLocalStorage = createPersistentStateHooks(localStorageWrapper);
export const useSessionStorage = createPersistentStateHooks(sessionStorageWrapper);
