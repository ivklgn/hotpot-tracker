import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiPieChart, FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useState } from 'react';

const Feature = ({
  title,
  text,
  icon,
  imageSrc,
}: {
  title: string;
  text: string;
  icon: any;
  imageSrc: string;
}) => {
  return (
    <Stack gap={4} align="start">
      <Box position="relative" rounded="xl" overflow="hidden" w="full" h="200px" mb={4}>
        <Image
          src={imageSrc}
          alt={title}
          objectFit="cover"
          w="full"
          h="full"
          transition="transform 0.3s"
          _hover={{ transform: 'scale(1.05)' }}
        />
        <Flex
          position="absolute"
          top={4}
          left={4}
          w={12}
          h={12}
          align="center"
          justify="center"
          color="white"
          rounded="full"
          bg="blue.500"
          shadow="lg"
        >
          <Icon as={icon} w={6} h={6} />
        </Flex>
      </Box>
      <Box>
        <Heading size="md" mb={2}>
          {title}
        </Heading>
        <Text color={'gray.600'}>{text}</Text>
      </Box>
    </Stack>
  );
};

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Box bg={'white'} p={8} rounded="xl" shadow="xl" w={{ base: 'full', md: '400px' }}>
      <VStack gap={4}>
        <Heading size="lg">{isSignUp ? 'Create Account' : 'Welcome Back'}</Heading>
        {/* <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="your@email.com" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="••••••••" />
        </FormControl>
        {isSignUp && (
          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input type="password" placeholder="••••••••" />
          </FormControl>
        )} */}
        <Button w="full" colorScheme="blue" bg="blue.400" _hover={{ bg: 'blue.500' }} size="lg">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Button
          // variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          color="blue.500"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </Button>
      </VStack>
    </Box>
  );
};

export default function Landing() {
  const features = [
    {
      title: 'Track Your Expenses',
      text: 'Keep detailed records of your hotpot dining experiences and expenses. Set budgets, track spending patterns, and manage your hotpot budget effectively.',
      icon: FiPieChart,
      imageSrc: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800',
    },
    {
      title: 'Real-time Updates',
      text: 'Get instant updates on your spending and dining history. Receive notifications about your favorite restaurants and track your most-ordered ingredients.',
      icon: FiClock,
      imageSrc: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800',
    },
    {
      title: 'Analytics Dashboard',
      text: 'Visualize your hotpot habits with beautiful charts and insights. Understand your spending patterns and discover new ways to optimize your dining experience.',
      icon: FiTrendingUp,
      imageSrc: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800',
    },
    {
      title: 'Share with Friends',
      text: 'Split bills and share experiences with your dining companions. Create group events, manage shared expenses, and keep track of who owes what.',
      icon: FiUsers,
      imageSrc: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=800',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW="7xl" py={32}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          gap={{ base: 8, md: 10 }}
          justify="space-between"
        >
          <Stack flex={1} gap={{ base: 5, md: 10 }}>
            <Heading fontWeight={800} fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }} lineHeight="110%">
              Track Your{' '}
              <Text as="span" color="blue.400">
                Hotpot Adventures
              </Text>
            </Heading>
            <Text fontSize={{ base: 'lg', sm: 'xl' }} color={'gray.600'}>
              Never lose track of your hotpot expenses again. Our smart tracker helps you manage costs, split
              bills, and discover your favorite ingredients.
            </Text>
          </Stack>
          <AuthForm />
        </Stack>
      </Container>

      {/* Features Section */}
      <Box bg={'gray.50'} py={20}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="7xl" py={32}>
        <Stack direction={{ base: 'column', md: 'row' }} gap={8} align="center" justify="space-between">
          <Stack flex={1} gap={4}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Ready to Start Tracking?</Heading>
            <Text fontSize="xl" color={'gray.600'}>
              Join thousands of hotpot enthusiasts who are managing their dining experiences smarter.
            </Text>
          </Stack>
          <Stack direction={{ base: 'column', sm: 'row' }} gap={4}>
            <Button rounded="full" size="lg" colorScheme="blue" bg="blue.400" _hover={{ bg: 'blue.500' }}>
              Sign Up Now
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
