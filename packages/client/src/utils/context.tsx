import { createContext, Dispatch, FC, PropsWithChildren, useContext, useReducer } from 'react';

export const createAppContext = <T extends object>(initialState: T) => {
  const StateContext = createContext<T | null>(null);

  const DispatchContext = createContext<Dispatch<Partial<T>> | null>(null);

  const Reducer = (state: T, newState: Partial<T>) => ({
    ...state,
    ...newState,
  });

  const Provider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
      </StateContext.Provider>
    );
  };

  const useAppContext = (): {
    state: T;
    dispatch: Dispatch<Partial<T>>;
  } => {
    const stateContext = useContext(StateContext);
    const dispatchContext = useContext(DispatchContext);

    if (dispatchContext === null || stateContext === null) {
      throw new Error('useAppContext необходимо использовать внутри Provider');
    }

    return {
      state: stateContext,
      dispatch: dispatchContext,
    };
  };

  Provider.displayName = 'CreateAppContextProvider';

  return {
    Provider,
    useAppContext,
  };
};
