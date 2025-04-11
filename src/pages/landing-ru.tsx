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
import { Auth } from '../features/auth';
import { db } from '../instantdb';
import { UserAvatar } from '../components/Avatars';
import { Link, useLocation } from 'wouter';
import tariffLimits from '../../tariff-limits.json';
import { useColorMode } from '../components/ui/color-mode';
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
          maxH="700px"
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
                <Link to="/workspace">В аккаунт</Link>
              </ChakraLink>
              <Separator orientation="vertical" height="4" />
              <ChakraLink asChild color="red.500" onClick={handleSignOutClick}>
                <Link to="/workspace">Выход</Link>
              </ChakraLink>
            </HStack>
          </Stack>
        </HStack>
      ) : (
        <Box>
          <Text textStyle="2xl" textAlign="center" mb={4}>
            Войти или зарегистрироваться по email
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
                  Tracker 🥢
                </Text>
              </Heading>
              <Text fontSize={{ base: 'lg', sm: 'xl' }} maxW="xl">
                <strong>«Приготовь так, как считаешь нужным»</strong> <br />
                Обычные agile-доски – это ресторан с шефом, где ты не влияешь на процесс. Hotpot (
                <ChakraLink
                  href="https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D0%B3%D0%BE"
                  target="_blank"
                  variant="underline"
                >
                  хого
                </ChakraLink>
                ): готовь процесс по своему вкусу.
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
                  Начать
                </Button>
                <Button rounded="full" size="lg" fontWeight="bold" px={6} variant="outline">
                  <ChakraLink href="#about">Подробнее</ChakraLink>
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
              Еще один клон Trello?
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Почти... Но не совсем. Кроме простых примитивов таких как доски, задачи - Hotpot предлагает
              встроенные возможности для вовлечения команды в процесс.
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
          <Stack flex={1} gap={6} textAlign="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>С любовью от инженеров 🤓</Heading>
            <Text fontSize="xl" maxW="3xl" mx="auto">
              В разработке программного обеспечения существуют подходы и инструменты, полезные и для бизнеса.
              Hotpot заимствует идеи из Github/Gitlab, чтобы принести новые идеи в командные процессы.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10} textAlign="left">
              <FeatureCard
                title="Больше досок"
                text="Создавай доски под определенные проекты/задачи вместо одной большой и универсальной."
              />
              <FeatureCard
                title="Вовлечение команды"
                text="Назначайте членов команды на всех этапах работы (колонках) в роли проверяющих"
              />
              <FeatureCard
                title="Простые атрибуты"
                text="Вместо предустановленных полей в задачах - произвольные ключ-значения для выражения любых смыслов"
              />
              <FeatureCard
                title="Одобрения"
                text="Блокируйте ход задачи по этапам если ее не одобрят ваши коллеги"
              />
              <FeatureCard
                title="Комментарии - зло"
                text="Вместо этого обсуждайте конкретные идеи в самом документе"
              />
              <FeatureCard
                title="AI"
                text="Чем точнее отобразишь процесс на доске тем лучше AI сможет его понять"
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Box>
        <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
          Интересные возможности
        </Heading>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
              Атрибуты для досок и задач
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Задачи автоматически наследуют атрибуты доски — такие как срок, исполнитель, приоритет и
              прогресс — и чем осмысленнее заданы эти параметры, тем эффективнее ИИ помогает с отчетностью
            </Text>
          </VStack>
          <Image src={colorMode === 'light' ? boardAILight : boardAIDark} borderRadius="md" shadow="lg" />
        </Container>
      </Box>

      <Box py={16}>
        <Container maxW="7xl">
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
              Возможность указать проверяющих пользователей
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Колонка — это этап работы, на котором задачу проверяют назначенные пользователи, и пока не
              выполнены правила одобрения, продвижение задачи по этапам блокируется.
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
              Обсуждения в задачах
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              В задаче можно создать обсуждение, которое должно быть завершено и закрыто в процессе общения, а
              сам процесс интегрирован в систему одобрений и проверок.
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
                Иногда важно отбросить лишнее. Hotpot Tracker оставляет пользователю привычный интерфейс, но
                убирает малоэффективные методы организации работы.
              </Blockquote.Content>
              <Blockquote.Caption>
                <cite>
                  <HStack mt="2" gap="3">
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name="Иван К., Автор" />
                      <Avatar.Image src="https://www.ivklgn.blog/assets/me.jpg" />
                    </Avatar.Root>
                    <ChakraLink href="https://www.ivklgn.blog" target="_blank">
                      <Span fontWeight="medium">Иван К., Автор</Span>
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
          <VStack gap={8} mb={12}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} textAlign="center">
              Цены
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="3xl">
              Сейчас мы находимся в <strong>альфа</strong>-версии, вы можете попробовать нашу систему
              бесплатно
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
                  Бесплатно
                </Text>
              </Box>
              <VStack p={6} align="stretch" gap={6}>
                <HStack>
                  <Heading fontSize="5xl">$0</Heading>
                  <Text alignSelf="end">/ месяц</Text>
                </HStack>
                <Text>Идеально подходит небольших команд</Text>
                <Link to="/workspace">
                  <Button colorScheme="blue" size="lg" w="full">
                    Начать
                  </Button>
                </Link>
                <VStack align="start">
                  <Heading size="sm">Ограничения:</Heading>
                  <HStack>
                    <Icon as={LuUserPlus} color="green.500" />
                    <Text>{tariffLimits.free.max_teams_per_account} команд на аккаунт</Text>
                  </HStack>
                  <HStack>
                    <Icon as={LuUsers} color="green.500" />
                    <Text>{tariffLimits.free.max_members_per_team} участников на команду</Text>
                  </HStack>
                  <HStack>
                    <Icon as={LuSquareKanban} color="green.500" />
                    <Text>{tariffLimits.free.max_boards_per_team} досок на команду</Text>
                  </HStack>
                  <HStack>
                    <Icon as={LuSquareMenu} color="green.500" />
                    <Text>{tariffLimits.free.max_tasks_per_team} задач на команду</Text>
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
              <Text>© 2025 Hotpot Tracker. Все права защищены.</Text>
            </Stack>
            <Stack direction={{ base: 'column', md: 'row' }} gap={8}>
              <ChakraLink href="https://www.ivklgn.blog" target="_blank">
                Блог
              </ChakraLink>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
