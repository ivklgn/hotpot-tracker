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
  SimpleGrid,
  Button,
  VStack,
  Avatar,
  Blockquote,
  Float,
  Span,
} from '@chakra-ui/react';
// import mockupRecipe from '../assets/mockup-recipe-tracking.png';
// import mockupPlanning from '../assets/mockup-meal-planning.png';
// import mockupAnalytics from '../assets/mockup-taste-analytics.png';
import { Auth } from '../features/auth';
import { db } from '../instantdb';
import { UserAvatar } from '../components/Avatars';
import { Link, useLocation } from 'wouter';
import { FaUtensils, FaClipboardList, FaUsers, FaChartLine, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import tariffLimits from '../../tariff-limits.json';

import s from './landing.module.css';

interface FeatureCardProps {
  icon: React.ComponentType;
  title: string;
  text: string;
}

interface FeatureShowcaseProps {
  image?: string;
  title: string;
  description: string;
  features: string[];
  isReversed?: boolean;
}

const FeatureCard = ({ icon, title, text }: FeatureCardProps) => {
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
      <Flex w={12} h={12} align="center" justify="center" rounded="full" bg="blue.400">
        <Icon as={icon} w={6} h={6} />
      </Flex>
      <Heading fontSize="xl">{title}</Heading>
      <Text color="gray.600">{text}</Text>
    </VStack>
  );
};

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
          objectFit="cover"
          boxShadow="2xl"
          width={{ base: '100%', md: '90%' }}
          height="auto"
          maxH="400px"
          transition="transform 0.3s ease-in-out"
          _hover={{ transform: 'scale(1.02)' }}
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
  const [, navigate] = useLocation();

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
                  Tracker
                </Text>
              </Heading>
              <Text fontSize={{ base: 'lg', sm: 'xl' }} maxW="xl">
                <strong>«Cook it the way you want it»</strong> <br />
                Try simple and useful primitives to build a more efficient process for your projects.
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
              One more Trello?
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Almost.. But not quite. Hotpot Tracker provide couple new primitive features for improve your
              workflow
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10}>
            <FeatureCard
              icon={FaUtensils}
              title="Recipe Tracking"
              text="Save and organize your favorite hotpot recipes and ingredient combinations."
            />
            <FeatureCard
              icon={FaClipboardList}
              title="Meal Planning"
              text="Plan your hotpot meals in advance with smart shopping lists and preparation guides."
            />
            <FeatureCard
              icon={FaUsers}
              title="Social Sharing"
              text="Share your hotpot experiences with friends and discover new recipes from the community."
            />
            <FeatureCard
              icon={FaChartLine}
              title="Taste Analytics"
              text="Track your preferences over time and get personalized recommendations."
            />
            <FeatureCard
              icon={FaMobileAlt}
              title="Mobile Friendly"
              text="Access your hotpot tracker anywhere, anytime with our responsive design."
            />
            <FeatureCard
              icon={FaShieldAlt}
              title="Secure Storage"
              text="Your recipes and preferences are securely stored and backed up."
            />
          </SimpleGrid>
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
              See Hotpot Tracker in Action
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Discover how our intuitive interface makes managing your hotpot experiences a delight
            </Text>
          </VStack>

          <VStack gap={20}>
            <FeatureShowcase
              // image={mockupRecipe}
              title="Intuitive Recipe Management"
              description="Easily create, organize, and discover hotpot recipes that match your taste preferences."
              features={[
                'Drag-and-drop interface for building custom recipes',
                'Smart ingredient pairing suggestions',
                'Filter recipes by dietary preferences and restrictions',
                'Save favorite combinations for quick access',
              ]}
            />

            <FeatureShowcase
              // image={mockupPlanning}
              title="Smart Meal Planning"
              description="Plan your hotpot gatherings with precision and eliminate the guesswork."
              features={[
                'Automatic portion calculations based on guest count',
                'Integrated shopping lists with ingredient quantities',
                'Preparation timelines and reminders',
                'Dietary restriction tracking for guests',
              ]}
              isReversed={true}
            />

            <FeatureShowcase
              // image={mockupAnalytics}
              title="Personalized Analytics"
              description="Gain insights into your hotpot preferences and discover new flavor combinations."
              features={[
                'Visual taste profile development over time',
                'Ingredient pairing recommendations based on your history',
                'Seasonal trend analysis for optimal ingredient selection',
                'Community comparison to discover new possibilities',
              ]}
            />
          </VStack>
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <Stack flex={1} gap={6} textAlign="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>From engineers with love</Heading>
            <Text fontSize="xl" maxW="3xl" mx="auto">
              We provide the most important features from open-source systems like conversations in merge/pull
              requests. Built by engineers who are passionate about both code and cuisine.
            </Text>
            <Blockquote.Root bg="bg.subtle" padding="8" maxW="7xl">
              <Float placement="bottom-end" offset="10">
                <Blockquote.Icon opacity="0.4" boxSize="10" rotate="180deg" />
              </Float>
              <Blockquote.Content cite="Uzumaki Naruto">
                If anyone thinks he is something when he is nothing, he deceives himself. Each one should test
                his own actions. Then he can take pride in himself, without comparing himself to anyone else.
              </Blockquote.Content>
              <Blockquote.Caption>
                <cite>
                  <HStack mt="2" gap="3">
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name="Emily Jones" />
                      <Avatar.Image src="https://i.pravatar.cc/150?u=re" />
                    </Avatar.Root>
                    <Span fontWeight="medium">Emily Jones</Span>
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
              Our plans
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Now we are in <strong>apha</strong>, you can try our system for free
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} alignItems="center">
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
                <Text>
                  Perfect for individuals and small teams just getting started with hotpot tracking.
                </Text>
                <Button colorScheme="blue" size="lg" w="full">
                  Get Started
                </Button>
                <VStack align="start">
                  <Heading size="sm">Plane include:</Heading>
                  <HStack>
                    <Icon as={FaUsers} color="green.500" />
                    <Text>{tariffLimits.free.max_teams_per_account} teams per account</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaUsers} color="green.500" />
                    <Text>{tariffLimits.free.max_members_per_team} members per team</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaClipboardList} color="green.500" />
                    <Text>{tariffLimits.free.max_boards_per_team} boards per team</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaUtensils} color="green.500" />
                    <Text>{tariffLimits.free.max_tasks_per_team} tasks per team</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <Stack flex={1} gap={6} textAlign="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Start now for free</Heading>
            <Text fontSize="xl" maxW="3xl" mx="auto">
              You can start
            </Text>
            <Flex justify="center" mt={4}>
              <AuthForm />
            </Flex>
          </Stack>
        </Container>
      </Box>

      <Box py={10}>
        <Container maxW="7xl">
          <Stack direction={{ base: 'column', md: 'row' }} gap={8} justify="space-between">
            <Stack gap={4} align={{ base: 'center', md: 'flex-start' }}>
              <Text>© 2025 Hotpot Tracker. All rights reserved.</Text>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} gap={8}>
              <ChakraLink>Blog</ChakraLink>
              {/* <ChakraLink>Help Center</ChakraLink>
              <ChakraLink>Community</ChakraLink> */}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
