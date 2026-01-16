import { Flex, Text, HStack, Stack, Separator, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'wouter';
import { Auth } from '@/features/auth';
import { db } from '@/instantdb';
import { UserAvatar } from '@/components/Avatars';
import type { LandingLocale } from '../locales/types';

interface AuthFormProps {
  readonly locale: LandingLocale;
}

export function AuthForm({ locale }: AuthFormProps) {
  const { user } = db.useAuth();
  const handleSignOutClick = () => {
    db.auth.signOut();
  };

  return (
    <Flex
      p={6}
      rounded="lg"
      minW={{ base: '100%', md: '400px' }}
      direction="column"
      gap={4}
      justifyContent="center"
      borderWidth="1px"
      borderColor="border"
      bg="bg"
    >
      {user ? (
        <HStack key={user?.email} gap="4">
          <Link to="/workspace">
            <UserAvatar user={{ userId: user?.id as string, userEmail: user?.email as string }} />
          </Link>
          <Stack gap="0">
            <Link to="/workspace">
              <Text fontWeight="medium">{user?.email}</Text>
            </Link>
            <HStack gap={2}>
              <ChakraLink asChild color="fg.muted" fontSize="sm">
                <Link to="/workspace">{locale.authForm.loggedInAccount}</Link>
              </ChakraLink>
              <Separator orientation="vertical" height="3" />
              <ChakraLink
                as="button"
                color="red.500"
                fontSize="sm"
                onClick={handleSignOutClick}
                cursor="pointer"
              >
                {locale.authForm.signOut}
              </ChakraLink>
            </HStack>
          </Stack>
        </HStack>
      ) : (
        <Auth />
      )}
    </Flex>
  );
}
