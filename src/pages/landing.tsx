import {
  Box,
  Image,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  HStack,
  Link as ChakraLink,
  Separator,
} from '@chakra-ui/react';
import logoShort from '../assets/logo-short.png';
import { Auth } from '../features/auth';
import { db } from '../instantdb';
import { UserAvatar } from '../components/Avatars';
import { Link } from 'wouter';

const AuthForm = () => {
  const { user } = db.useAuth();
  const handleSignOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    db.auth.signOut();
  };

  return (
    <Flex
      p={8}
      rounded="xl"
      shadow="xl"
      w={{ base: 'full', md: '480px', sm: '100%' }}
      direction="column"
      gap={4}
      justifyContent="center"
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
              <ChakraLink asChild variant="underline">
                <Link to="/workspace">Go to workspace</Link>
              </ChakraLink>
              <Separator orientation="vertical" height="4" />
              <ChakraLink asChild color="red.500" onClick={handleSignOutClick}>
                <Link to="/workspace">Logout</Link>
              </ChakraLink>
            </HStack>
          </Stack>
        </HStack>
      ) : (
        <Box>
          <Text textStyle="2xl" textAlign="center" mb={4}>
            Try now for free
          </Text>
          <Auth />
        </Box>
      )}
    </Flex>
  );
};

export function Landing() {
  return (
    <Box>
      <Container maxW="7xl" py={8}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          gap={{ base: 8, md: 10 }}
          justify="space-between"
          alignItems="flex-start"
        >
          <Stack flex={1} gap={{ base: 5, md: 10 }}>
            <Heading fontWeight={800} fontSize={{ base: '2xl', sm: '3xl', md: '5xl' }} lineHeight="110%">
              Hotpot{' '}
              <Text as="span" color="blue.400">
                Tracker
              </Text>
            </Heading>
            <Text fontSize={{ base: 'lg', sm: 'xl' }}>
              <HStack textAlign="left">
                <p>
                  <strong>"Cook it the way you want it"</strong> <br />
                  Try simple and useful primitives to build a more efficient process for your projects.
                </p>
              </HStack>
            </Text>
          </Stack>
          <AuthForm />
        </Stack>
      </Container>

      <Box bg={'gray.50'} py={12}>
        <Container>
          <Flex justifyContent="space-around" wrap="wrap">
            <Box textAlign="center" flex="0 0 33.3333%" padding="12">
              <Heading>I'm a Heading</Heading>
              <Text textStyle="md">Chakra</Text>
            </Box>
            <Box textAlign="center" flex="0 0 33.3333%" padding="12">
              <Heading>I'm a Heading</Heading>
              <Text textStyle="md">Chakra</Text>
            </Box>
            <Box textAlign="center" flex="0 0 33.3333%" padding="12">
              <Heading>I'm a Heading</Heading>
              <Text textStyle="md">Chakra</Text>
            </Box>
            <Box textAlign="center" flex="0 0 33.3333%" padding="12">
              <Heading>I'm a Heading</Heading>
              <Text textStyle="md">Chakra</Text>
            </Box>
            <Box textAlign="center" flex="0 0 33.3333%" padding="12">
              <Heading>I'm a Heading</Heading>
              <Text textStyle="md">Chakra</Text>
            </Box>
            <Box textAlign="center" flex="0 0 33.3333%" padding="12">
              <Heading>I'm a Heading</Heading>
              <Text textStyle="md">Chakra</Text>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box py={12}>
        <Container maxW="7xl" py={12}>
          <Stack flex={1} gap={4} alignItems="center">
            <Box mb="6">
              <Image rounded="md" src={logoShort} alt="" maxW={120} />
            </Box>
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Ready to Start Tracking?</Heading>
            <Text fontSize="xl" color={'gray.600'}>
              Join thousands of hotpot enthusiasts who are managing their dining experiences smarter.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Box bg={'gray.50'} py={12}>
        <Container maxW="7xl" py={12}>
          <Stack flex={1} gap={4} textAlign="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>From engineers with love</Heading>
            <Text fontSize="xl" color={'gray.600'}>
              We provide the most important features from open-source systems like conversations in merge/pull
              requests.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Box py={12}>
        <Container maxW="7xl" py={12}>
          <Stack flex={1} gap={4} textAlign="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Ready to Start Tracking?</Heading>
            <Text fontSize="xl" color={'gray.600'}>
              Join thousands of hotpot enthusiasts who are managing their dining experiences smarter.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* <Box bg={'gray.50'} py={12}>
        <Container maxW="7xl" py={12}>
          <Stack flex={1} gap={4} alignItems="center">
            <Flex
              p={8}
              rounded="xl"
              shadow="xl"
              w={{ base: 'full', md: '480px', sm: '100%' }}
              direction="column"
              gap={4}
              justifyContent="center"
            >
              <Box mb="6">
                <Image rounded="md" src={logoShort} alt="" maxW={120} />
              </Box>
              <Heading fontSize={{ base: '3xl', md: '4xl' }}>Try it for free</Heading>
              <Auth />
            </Flex>
          </Stack>
        </Container>
      </Box> */}
    </Box>
  );
}
