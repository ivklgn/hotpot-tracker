import { Flex } from '@chakra-ui/react';
import { AccountContext } from './AccountContext';
import { useLocalStorage } from '../web-storage';
import { db } from '../../instantdb';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const { data: teams, isLoading: isLoadingTeams } = db.useQuery({ teams: {} });
  const [currentTeamId, setCurrentTeamId] = useLocalStorage<string | undefined>('currentTeamId', undefined);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!teams?.teams || teams.teams.length === 0) {
      navigate('/workspace', { replace: true });
    }
  }, [navigate, teams?.teams]);

  if (isLoadingTeams) {
    return null;
  }

  return (
    <AccountContext.Provider value={{ currentTeamId, setCurrentTeamId }}>
      <Flex direction="column" minH="100vh">
        {children}
      </Flex>
    </AccountContext.Provider>
  );
}
