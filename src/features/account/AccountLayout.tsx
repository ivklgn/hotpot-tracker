import { Flex } from '@chakra-ui/react';
import { AccountContext } from './AccountContext';
import { useState } from 'react';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const [currentTeamId, setCurrentTeamId] = useState<string | undefined>(undefined);

  return (
    <AccountContext.Provider value={{ currentTeamId, setCurrentTeamId }}>
      <Flex direction="column" minH="100vh">
        {children}
      </Flex>
    </AccountContext.Provider>
  );
}
