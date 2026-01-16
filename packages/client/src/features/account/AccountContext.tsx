import React, { Dispatch, SetStateAction, useContext } from 'react';

export type AccountContextType = {
  currentTeamId?: string;
  setCurrentTeamId: Dispatch<SetStateAction<string | undefined>>;
};

export const AccountContext = React.createContext<AccountContextType | null>(null);

export const useAccount = () => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error('useAccount must be used within an AccountContext provider');
  }

  return context;
};
