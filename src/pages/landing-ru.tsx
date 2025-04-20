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
                    window.location.href = '/auth';
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
          <VStack gap={8} mb={12} px={{ base: 4, md: 0 }}>
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
          <Stack flex={1} gap={6} textAlign="center" alignItems="center">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>С любовью от инженеров</Heading>
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
                  Бесплатно
                </Text>
              </Box>
              <VStack p={6} align="stretch" gap={6}>
                <HStack flexWrap="wrap">
                  <Heading fontSize="5xl">$0</Heading>
                  <Text alignSelf="end">/ месяц</Text>
                </HStack>
                <Text>Идеально подходит небольших команд</Text>
                <Link href="/workspace">
                  <Button colorScheme="blue" size="lg" w="full">
                    Начать
                  </Button>
                </Link>
                <VStack align="start" gap={3}>
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
          <Stack
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 6, md: 4 }}
            justify="space-between"
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Text>© 2025 Hotpot Tracker. Все права защищены.</Text>

            <Stack
              direction={{ base: 'column', md: 'row' }}
              gap={{ base: 2, md: 4 }}
              align={{ base: 'center', md: 'center' }}
            >
              <ChakraLink href="https://forms.gle/aCK2VbQ9pEAWfWSHA" target="_blank">
                Сообщить о проблеме
              </ChakraLink>
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
