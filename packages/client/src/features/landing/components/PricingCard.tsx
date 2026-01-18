import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Flex,
  HStack,
  Icon,
  Button,
  Badge,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { Link } from 'wouter';
import { LuCheck, LuExternalLink } from 'react-icons/lu';
import { tariffLimits } from '@hotpot/shared';
import type { LandingLocale } from '../locales/types';

interface PricingCardProps {
  readonly locale: LandingLocale;
}

export function PricingCard({ locale }: PricingCardProps) {
  const cloudLimits = [
    `${tariffLimits.free.max_teams_per_account} ${locale.pricing.teams}`,
    `${tariffLimits.free.max_members_per_team} ${locale.pricing.membersPerTeam}`,
    `${tariffLimits.free.max_boards_per_team} ${locale.pricing.boardsPerTeam}`,
    `${tariffLimits.free.max_tasks_per_team} ${locale.pricing.tasksPerTeam}`,
  ];

  return (
    <Box py={{ base: 12, md: 20 }} bg="bg.muted" id="pricing">
      <Container maxW="6xl">
        <Stack gap={{ base: 8, md: 12 }}>
          <VStack gap={3} textAlign="center">
            <Text fontSize="sm" fontWeight={500} color="blue.500">
              {locale.pricing.title}
            </Text>
            <Text fontSize="md" color="fg.muted" maxW="lg">
              {locale.pricing.description}
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} maxW="4xl" mx="auto" w="full">
            {/* Free Cloud Card */}
            <Box
              borderWidth="1px"
              borderColor="border"
              rounded="xl"
              p={6}
              bg="bg"
            >
              <VStack align="stretch" gap={5}>
                <Heading fontSize="xl" fontWeight={600}>
                  {locale.pricing.planName}
                </Heading>

                <HStack align="baseline">
                  <Heading fontSize="4xl" fontWeight={600}>
                    {locale.pricing.price}
                  </Heading>
                  <Text color="fg.muted" fontSize="sm">
                    {locale.pricing.period}
                  </Text>
                </HStack>

                <Text fontSize="sm" color="fg.muted">
                  {locale.pricing.subtitle}
                </Text>

                <Link href="/auth" style={{ width: '100%' }}>
                  <Button w="full" bg="fg" color="bg" _hover={{ opacity: 0.9 }}>
                    {locale.pricing.cta}
                  </Button>
                </Link>

                <VStack align="start" gap={2} pt={2}>
                  {cloudLimits.map((limit) => (
                    <HStack key={limit} gap={2}>
                      <Icon as={LuCheck} boxSize={4} color="fg.muted" />
                      <Text fontSize="sm" color="fg.muted">
                        {limit}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Box>

            {/* Self-Hosted Card */}
            <Box
              borderWidth="1px"
              borderColor="border"
              rounded="xl"
              p={6}
              bg="bg"
            >
              <VStack align="stretch" gap={5}>
                <Flex align="center" gap={3}>
                  <Heading fontSize="xl" fontWeight={600}>
                    {locale.pricing.selfHosted.title}
                  </Heading>
                  <Badge colorPalette="green" variant="subtle" size="sm">
                    {locale.pricing.selfHosted.badge}
                  </Badge>
                </Flex>

                <HStack align="baseline">
                  <Heading fontSize="4xl" fontWeight={600}>
                    {locale.pricing.selfHosted.price}
                  </Heading>
                  <Text color="fg.muted" fontSize="sm">
                    {locale.pricing.selfHosted.period}
                  </Text>
                </HStack>

                <Text fontSize="sm" color="fg.muted">
                  {locale.pricing.selfHosted.subtitle}
                </Text>

                <Button
                  w="full"
                  variant="outline"
                  asChild
                >
                  <a href="https://github.com/ivklgn/hotpot-tracker?tab=readme-ov-file#self-hosted-deployment" target="_blank" rel="noopener noreferrer">
                    {locale.pricing.selfHosted.cta}
                    <Icon as={LuExternalLink} ml={2} boxSize={4} />
                  </a>
                </Button>

                <VStack align="start" gap={2} pt={2}>
                  {locale.pricing.selfHosted.features.map((feature) => (
                    <HStack key={feature} gap={2}>
                      <Icon as={LuCheck} boxSize={4} color="green.500" />
                      <Text fontSize="sm" color="fg.muted">
                        {feature}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
