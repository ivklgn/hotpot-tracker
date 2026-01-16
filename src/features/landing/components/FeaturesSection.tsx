import { Box, Container, SimpleGrid, Heading, Text, Stack } from '@chakra-ui/react';
import {
  LuLayoutGrid,
  LuUsers,
  LuTag,
  LuCircleCheck,
  LuMessageSquare,
  LuSparkles,
} from 'react-icons/lu';
import type { LandingLocale } from '../locales/types';
import { FeatureCard } from './FeatureCard';

interface FeaturesSectionProps {
  readonly locale: LandingLocale;
}

export function FeaturesSection({ locale }: FeaturesSectionProps) {
  const features = [
    { ...locale.features.moreBoards, icon: LuLayoutGrid },
    { ...locale.features.teamEngagement, icon: LuUsers },
    { ...locale.features.simpleAttributes, icon: LuTag },
    { ...locale.features.approvals, icon: LuCircleCheck },
    { ...locale.features.commentsAreEvil, icon: LuMessageSquare },
    { ...locale.features.ai, icon: LuSparkles },
  ];

  return (
    <Box py={{ base: 12, md: 16 }} id="features">
      <Container maxW="6xl">
        <Stack gap={{ base: 8, md: 10 }}>
          <Stack gap={3} maxW="2xl">
            <Text fontSize="sm" fontWeight={500} color="blue.500">
              {locale.intro.title}
            </Text>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight={600} letterSpacing="-0.02em">
              {locale.about.title}
            </Heading>
            <Text fontSize="sm" color="fg.muted" lineHeight="1.7">
              {locale.intro.description}
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                text={feature.description}
                icon={feature.icon}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
