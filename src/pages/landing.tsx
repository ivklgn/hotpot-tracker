/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Icon,
  Button,
  VStack,
  Avatar,
  Blockquote,
  Float,
  Span,
  SimpleGrid,
  AvatarGroup,
} from '@chakra-ui/react';
import { Auth } from '../features/auth';
import { db } from '../instantdb';
import { UserAvatar } from '../components/Avatars';
import { Link } from 'wouter';
import tariffLimits from '../../tariff-limits.json';
import { LuUserPlus, LuUsers, LuSquareMenu, LuSquareKanban } from 'react-icons/lu';

import boardScreenshotLight from '../assets/board-screenshot-light.png';
import boardScreenshotDark from '../assets/board-screenshot-dark.png';
import boardColumnEditLight from '../assets/board-column-edit-light.png';
import boardColumnEditDark from '../assets/board-column-edit-dark.png';
import boardAILight from '../assets/board-ai-light.png';
import boardAIDark from '../assets/board-ai-dark.png';
import taskIssuesLight from '../assets/task-issues-light.png';
import taskIssuesDark from '../assets/task-issues-dark.png';

import s from './landing.module.css';
import { useColorMode } from '@/hooks/useColorMode';

interface FeatureCardProps {
  title: string;
  text: string;
}

const FeatureCard = ({ title, text }: FeatureCardProps) => {
  return (
    <VStack
      p={8}
      rounded="xl"
      shadow="md"
      borderWidth="1px"
      borderColor="gray.100"
      gap={4}
      align="start"
      height="100%"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        shadow: 'lg',
      }}
    >
      <Heading fontSize="xl">{title}</Heading>
      <Text>{text}</Text>
    </VStack>
  );
};

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
      minW="480px"
      direction="column"
      gap={4}
      justifyContent="center"
      borderWidth="1px"
      borderColor="gray.100"
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
                <Link to="/workspace">Account</Link>
              </ChakraLink>
              <Separator orientation="vertical" height="4" />
              <ChakraLink asChild color="red.500" onClick={handleSignOutClick}>
                <Link to="/workspace">Sign out</Link>
              </ChakraLink>
            </HStack>
          </Stack>
        </HStack>
      ) : (
        <Box>
          <Text textStyle="2xl" textAlign="center" mb={4}>
            Log in or register with email
          </Text>
          <Auth />
        </Box>
      )}
    </Flex>
  );
};

export function Landing() {
  const { colorMode } = useColorMode();

  return (
    <Box className={s.landing}>
      <Box position="relative" overflow="hidden" className={s.heroBlock}>
        <Container maxW="7xl" py={16}>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align="flex-start"
            gap={{ base: 8, md: 10 }}
            justify="space-between"
            alignItems="flex-start"
          >
            <Stack flex={1} gap={{ base: 5, md: 10 }}>
              <Heading fontWeight={800} fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }} lineHeight="110%">
                Hotpot{' '}
                <Text as="span" color="blue.400">
                  Tracker 🥢
                </Text>
              </Heading>
              <Text fontSize={{ base: 'lg', sm: 'xl' }} maxW="xl">
                <strong>“Cook it the way you want”</strong> <br />
                Traditional agile boards are like restaurants with a chef—you don’t control the process.
                Hotpot (
                <ChakraLink href="https://en.wikipedia.org/wiki/Huoguo" target="_blank" variant="underline">
                  hotpot
                </ChakraLink>
                ): cook your workflow your way.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} gap={4} mt={2}>
                {/* <Button
                  rounded="full"
                  size="lg"
                  fontWeight="bold"
                  px={6}
                  colorScheme="blue"
                  bg="blue.400"
                  _hover={{ bg: 'blue.500' }}
                  onClick={() => {
                    window.location.href = '/auth';
                  }}
                >
                  Get started
                </Button> */}
                <Button rounded="full" size="lg" fontWeight="bold" px={6} variant="outline">
                  <ChakraLink href="#about">Learn more</ChakraLink>
                </Button>
              </Stack>
            </Stack>
            {/* <AuthForm /> */}
          </Stack>
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
              Another Trello clone?
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Almost... but not quite. Besides simple primitives like boards and tasks, Hotpot offers built-in
              tools for team engagement.
            </Text>
          </VStack>
          <Image
            src={colorMode === 'light' ? boardScreenshotLight : boardScreenshotDark}
            borderRadius="md"
            shadow="lg"
          />
        </Container>
      </Box>

      <Box py={16} id="about">
        <Container maxW="7xl">
          <Stack flex={1} gap={6} textAlign="center" alignItems="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }} alignItems={'center'}>
              Lovingly built by engineers
            </Heading>
            <AvatarGroup size="xl">
              <ChakraLink href="https://github.com/ivklgn" target="_blank">
                <Avatar.Root>
                  <Avatar.Fallback name="Ivan K." />
                  <Avatar.Image src="https://avatars.githubusercontent.com/u/15219574?v=4" />
                </Avatar.Root>
              </ChakraLink>
              <ChakraLink href="https://github.com/toxanski" target="_blank">
                <Avatar.Root>
                  <Avatar.Fallback name="Anton S." />
                  <Avatar.Image src="https://avatars.githubusercontent.com/u/73133515?v=4" />
                </Avatar.Root>
              </ChakraLink>
            </AvatarGroup>
            <Text fontSize="xl" maxW="3xl" mx="auto">
              In software development, there are approaches and tools that are useful for business too. Hotpot
              borrows ideas from Github/Gitlab to bring fresh thinking into team workflows.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10} textAlign="left">
              <FeatureCard
                title="More boards"
                text="Create boards for specific projects/tasks instead of one large universal one."
              />
              <FeatureCard
                title="Team engagement"
                text="Assign team members to every stage (column) as reviewers"
              />
              <FeatureCard
                title="Simple attributes"
                text="Instead of preset fields in tasks—custom key-value attributes to express any meaning"
              />
              <FeatureCard
                title="Approvals"
                text="Block task progress between stages unless approved by peers"
              />
              <FeatureCard
                title="Comments are evil"
                text="Instead, discuss specific ideas right in the document"
              />
              <FeatureCard
                title="AI"
                text="The better your process is described, the more helpful AI can be"
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Box>
        <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
          Fascinating opportunities
        </Heading>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
              Instead of forced fields—define custom key-value pairs
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Due date, assignee, priority, and progress are task attributes inherited from the board, and
              using meaningful parameters ensures better AI reporting.
            </Text>
          </VStack>
          <Image src={colorMode === 'light' ? boardAILight : boardAIDark} borderRadius="md" shadow="lg" />
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
              Assign reviewers to verify tasks
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Columns represent workflow stages where tasks can be reviewed, with designated users required
              for approval and rules that block stage movement until approvals are granted.
            </Text>
          </VStack>
          <Image
            src={colorMode === 'light' ? boardColumnEditLight : boardColumnEditDark}
            borderRadius="md"
            shadow="lg"
          />
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
              Task-level discussions
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Create discussions within a task that must be resolved and closed, with the process integrated
              into approvals and reviews.
            </Text>
          </VStack>
          <Image
            src={colorMode === 'light' ? taskIssuesLight : taskIssuesDark}
            borderRadius="md"
            shadow="lg"
          />
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <Stack flex={1} gap={6} textAlign="center">
            <Blockquote.Root bg="bg.subtle" padding="8" maxW="7xl">
              <Float placement="bottom-end" offset="10">
                <Blockquote.Icon opacity="0.4" boxSize="10" rotate="180deg" />
              </Float>
              <Blockquote.Content>
                Sometimes it’s important to let go of the unnecessary. Hotpot Tracker keeps the familiar
                interface for the user but removes inefficient work organization methods.
              </Blockquote.Content>
              <Blockquote.Caption>
                <cite>
                  <HStack mt="2" gap="3">
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name="Ivan K., Creator" />
                      <Avatar.Image src="https://www.ivklgn.blog/assets/me.jpg" />
                    </Avatar.Root>
                    <ChakraLink href="https://www.ivklgn.blog" target="_blank">
                      <Span fontWeight="medium">Ivan K., Creator</Span>
                    </ChakraLink>
                  </HStack>
                </cite>
              </Blockquote.Caption>
            </Blockquote.Root>
          </Stack>
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12} px={{ base: 4, md: 0 }}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
              Pricing
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              We’re currently in <strong>alpha</strong>, you can try the system for free
            </Text>
          </VStack>

          <Flex justify="center" px={{ base: 4, sm: 6, md: 0 }}>
            <Box
              borderWidth="1px"
              borderColor="gray.200"
              rounded="xl"
              overflow="hidden"
              shadow="md"
              position="relative"
              transition="all 0.3s"
              _hover={{
                transform: 'translateY(-5px)',
                shadow: 'lg',
              }}
              width={{ base: '100%', sm: '350px' }}
              maxW="full"
            >
              <Box bg="blue.400" py={4} px={6}>
                <Text fontWeight="bold" fontSize="xl">
                  Free
                </Text>
              </Box>

              <VStack p={6} align="stretch" gap={6}>
                <HStack flexWrap="wrap">
                  <Heading fontSize="5xl">$0</Heading>
                  <Text alignSelf="end">/ month</Text>
                </HStack>

                <Text>Perfect for small teams</Text>

                <Button colorScheme="blue" size="lg" w="full" disabled>
                  Coming soon
                </Button>

                {/* <Link href="/workspace" style={{ width: '100%' }}>
                  <Button colorScheme="blue" size="lg" w="full">
                    Get started
                  </Button>
                </Link> */}

                <VStack align="start" gap={3}>
                  <Heading size="sm">Limits:</Heading>
                  <HStack>
                    <Icon as={LuUserPlus} color="green.500" />
                    <Text>{tariffLimits.free.max_teams_per_account} teams</Text>
                  </HStack>
                  <HStack>
                    <Icon as={LuUsers} color="green.500" />
                    <Text>{tariffLimits.free.max_members_per_team} members per team</Text>
                  </HStack>
                  <HStack>
                    <Icon as={LuSquareKanban} color="green.500" />
                    <Text>{tariffLimits.free.max_boards_per_team} boards per team</Text>
                  </HStack>
                  <HStack>
                    <Icon as={LuSquareMenu} color="green.500" />
                    <Text>{tariffLimits.free.max_tasks_per_team} tasks per team</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box py={10}>
        <Container maxW="7xl">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 6, md: 4 }}
            justify="space-between"
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Text>© 2025 Hotpot Tracker. All rights reserved.</Text>

            <Stack
              direction={{ base: 'column', md: 'row' }}
              gap={{ base: 2, md: 4 }}
              align={{ base: 'center', md: 'center' }}
            >
              <ChakraLink href="https://forms.gle/aCK2VbQ9pEAWfWSHA" target="_blank">
                Report problem
              </ChakraLink>
              <ChakraLink href="https://www.ivklgn.blog" target="_blank">
                Blog
              </ChakraLink>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
