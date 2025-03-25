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
} from '@chakra-ui/react';
import boardScreenshotLight from '../assets/board-screenshot-light.png';
import boardScreenshotDark from '../assets/board-screenshot-dark.png';
import columnScreenshotLight from '../assets/column-screenshot-light.png';
import columnScreenshotDark from '../assets/column-screenshot-dark.png';
import smartparamsScreenshotLight from '../assets/smartparams-screenshot-light.png';
import smartparamsScreenshotDark from '../assets/smartparams-screenshot-dark.png';
import { Auth } from '../features/auth';
import { db } from '../instantdb';
import { UserAvatar } from '../components/Avatars';
import { Link, useLocation } from 'wouter';
import tariffLimits from '../../tariff-limits.json';
import { useColorMode } from '../components/ui/color-mode';
import { LuUserPlus, LuUsers, LuSquareMenu, LuSquareKanban } from 'react-icons/lu';

import s from './landing.module.css';

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
      <Text color="gray.600">{text}</Text>
    </VStack>
  );
};

interface FeatureShowcaseProps {
  image?: string;
  title: string;
  description: string;
  features: string[];
  isReversed?: boolean;
}

const FeatureShowcase = ({
  image,
  title,
  description,
  features,
  isReversed = false,
}: FeatureShowcaseProps) => {
  return (
    <Stack
      direction={{ base: 'column', lg: isReversed ? 'row-reverse' : 'row' }}
      gap={{ base: 8, md: 10 }}
      py={10}
      align="center"
    >
      <Flex flex={1} justify="center">
        <Image
          rounded="md"
          alt={`${title} screenshot`}
          src={image}
          objectFit="contain"
          boxShadow="2xl"
          width={{ base: '100%', md: '90%' }}
          height="auto"
          maxH="480px"
          transition="transform 0.3s ease-in-out"
          _hover={{ transform: 'scale(1.02)' }}
          fit="contain"
        />
      </Flex>
      <Stack flex={1} gap={5}>
        <Heading fontSize={{ base: '2xl', sm: '3xl' }}>{title}</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">
          {description}
        </Text>
        <VStack align="start" gap={3}>
          {features.map((feature, index) => (
            <HStack key={index} align="start" gap={2}>
              <Box color="green.400" px={2}>
                •
              </Box>
              <Text fontSize={{ base: 'md', md: 'lg' }}>{feature}</Text>
            </HStack>
          ))}
        </VStack>
      </Stack>
    </Stack>
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
      w={{ base: 'full', md: '480px', sm: '100%' }}
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
                <Link to="/workspace">To account</Link>
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
            Sign in/register by email
          </Text>
          <Auth />
        </Box>
      )}
    </Flex>
  );
};

export function Landing() {
  const [, navigate] = useLocation();
  const { colorMode } = useColorMode();

  return (
    <Box className={s.landing}>
      <Box position="relative" overflow="hidden" className={s.heroBlock}>
        <Container maxW="7xl" py={16}>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            gap={{ base: 8, md: 10 }}
            justify="space-between"
            alignItems={{ base: 'center', lg: 'flex-start' }}
          >
            <Stack flex={1} gap={{ base: 5, md: 10 }}>
              <Heading fontWeight={800} fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }} lineHeight="110%">
                Hotpot{' '}
                <Text as="span" color="blue.400">
                  Tracker 🍲
                </Text>
              </Heading>
              <Text fontSize={{ base: 'lg', sm: 'xl' }} maxW="xl">
                <strong>"Cook it the way you see fit"</strong> <br />
                Regular agile boards are like a restaurant with a chef where you don't influence the process.
                Hotpot is like hotpot: gather your team and prepare your workflow to your taste. 🥢
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} gap={4} mt={2}>
                <Button
                  rounded="full"
                  size="lg"
                  fontWeight="bold"
                  px={6}
                  colorScheme="blue"
                  bg="blue.400"
                  _hover={{ bg: 'blue.500' }}
                  onClick={() => {
                    navigate('/auth');
                  }}
                >
                  Get Started
                </Button>
                <Button rounded="full" size="lg" fontWeight="bold" px={6} variant="outline">
                  Learn More
                </Button>
              </Stack>
            </Stack>
            <AuthForm />
          </Stack>
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
              Another Trello Clone?
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Almost... But not quite. Hotpot Tracker not only contains familiar primitives like
              boards/columns/tasks, but also adds several simple and interesting tools
            </Text>
          </VStack>
          <Image
            src={colorMode === 'light' ? boardScreenshotLight : boardScreenshotDark}
            borderRadius="md"
            shadow="lg"
          />
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <Stack flex={1} gap={6} textAlign="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>With love from engineers 🤓</Heading>
            <Text fontSize="xl" maxW="3xl" mx="auto">
              When working with open source, developers have many effective tools that business colleagues
              have never heard of.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10} textAlign="left">
              <FeatureCard
                title="More boards"
                text="Create boards for specific projects/tasks instead of one large and universal one."
              />
              <FeatureCard
                title="Team involvement"
                text="Assign team members at all stages of work (columns) in the role of reviewers"
              />
              <FeatureCard
                title="Simple attributes"
                text="Instead of imposed fields in tasks - arbitrary key-values to express any meanings"
              />
              <FeatureCard
                title="Approvals"
                text="Block the progress of a task through stages if it's not approved by your colleagues"
              />
              <FeatureCard
                title="Comments are evil"
                text="Instead, discuss a specific detail in the document itself"
              />
              <FeatureCard
                title="AI"
                text="The more accurately you display the process on the board, the better AI will be able to understand it"
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
              Interesting features
            </Heading>
          </VStack>

          <VStack gap={20}>
            <FeatureShowcase
              image={colorMode === 'light' ? smartparamsScreenshotLight : smartparamsScreenshotDark}
              title="Attributes for boards and tasks"
              description="Instead of imposed fields in tasks - arbitrary key-values"
              features={[
                "Deadline? Assignee? Priority? Progress? - it's an attribute",
                'Works the same way in both tasks and boards',
                'Tasks automatically inherit board parameters',
              ]}
            />

            <FeatureShowcase
              image={colorMode === 'light' ? columnScreenshotLight : columnScreenshotDark}
              title="Reviews and approvals"
              description="Ability to specify reviewing users"
              features={[
                'Column - a stage of work in which a task can be reviewed by the right people',
                'Choose a user who needs to approve the task',
                'Approval rules block task movement through stages',
              ]}
              isReversed={true}
            />

            <FeatureShowcase
              // image={colorMode === 'light' ? smartparamsScreenshotLight : smartparamsScreenshotDark}
              title="Discussions right in the tasks"
              description="Manage comment chaos by tying to a discussion of something specific in the task"
              features={[
                'Ability to create a discussion in a task',
                'During communication, the discussion should be completed and closed',
                'The discussion process is linked to approvals and reviews',
              ]}
            />
          </VStack>
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
                Sometimes it's important to discard the unnecessary. Our system removes imposed rules, helping
                to build a process based on real challenges.
              </Blockquote.Content>
              <Blockquote.Caption>
                <cite>
                  <HStack mt="2" gap="3">
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name="Ivan K., Author" />
                      <Avatar.Image src="https://www.ivklgn.blog/assets/me.jpg" />
                    </Avatar.Root>
                    <Span fontWeight="medium">
                      <ChakraLink href="https://www.ivklgn.blog/" target="_blank">
                        Ivan K., Creator of Hotpot Tracker
                      </ChakraLink>
                    </Span>
                  </HStack>
                </cite>
              </Blockquote.Caption>
            </Blockquote.Root>
          </Stack>
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
              Pricing
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              We are currently in <strong>alpha</strong> version, you can try our system for free
            </Text>
          </VStack>

          <Flex justifyContent="center">
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
              width="300px"
            >
              <Box bg="blue.400" py={4} px={6}>
                <Text fontWeight="bold" fontSize="xl">
                  Free
                </Text>
              </Box>
              <VStack p={6} align="stretch" gap={6}>
                <HStack>
                  <Heading fontSize="5xl">$0</Heading>
                  <Text alignSelf="end">/ month</Text>
                </HStack>
                <Text>Perfect for small teams</Text>
                <Link to="/workspace">
                  <Button colorScheme="blue" size="lg" w="full">
                    Get Started
                  </Button>
                </Link>
                <VStack align="start">
                  <Heading size="sm">Limitations:</Heading>
                  <HStack>
                    <Icon as={LuUserPlus} color="green.500" />
                    <Text>{tariffLimits.free.max_teams_per_account} teams per account</Text>
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
          <Stack direction={{ base: 'column', md: 'row' }} gap={8} justify="space-between">
            <Stack gap={4} align={{ base: 'center', md: 'flex-start' }}>
              <Text>© 2025 Hotpot Tracker. All rights reserved.</Text>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} gap={8}>
              {/* <ChakraLink>Blog</ChakraLink> */}
              {/* <ChakraLink>Help Center</ChakraLink>
              <ChakraLink>Community</ChakraLink> */}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
