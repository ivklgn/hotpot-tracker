import { Flex } from '@chakra-ui/react';
import { AccountContext } from './AccountContext';
import { useLocalStorage } from '../web-storage';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const [currentTeamId, setCurrentTeamId] = useLocalStorage<string | undefined>('currentTeamId', undefined);

  return (
    <AccountContext.Provider value={{ currentTeamId, setCurrentTeamId }}>
      <Flex direction="column" minH="100vh">
        {children}
      </Flex>
    </AccountContext.Provider>
  );
}
