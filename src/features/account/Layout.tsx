import { Flex } from '@chakra-ui/react';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <Flex direction="column" minH="100vh">
      {children}
    </Flex>
  );
}
