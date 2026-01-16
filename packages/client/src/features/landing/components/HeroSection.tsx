import { Box, Container, Stack, Heading, Text, Button, Link as ChakraLink, Flex } from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';
import type { LandingLocale } from '../locales/types';
import { ThemedImage } from './ThemedImage';
import { db } from '@/instantdb';
import styles from './HeroSection.module.css';

import boardScreenshotLight from '@/assets/board-screenshot-light.png';
import boardScreenshotDark from '@/assets/board-screenshot-dark.png';

interface HeroSectionProps {
  readonly locale: LandingLocale;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const { user } = db.useAuth();

  return (
    <Box py={{ base: 12, md: 20 }} className={styles.heroPattern}>
      <Container maxW="6xl" position="relative" zIndex={1}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 10, lg: 12 }}
          align="center"
        >
          <Stack flex={1} gap={6} maxW="xl">
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
              lineHeight="1.1"
              letterSpacing="-0.02em"
            >
              {locale.hero.title}
              <Text
                as="span"
                bgGradient="to-r"
                gradientFrom="blue.400"
                gradientTo="blue.600"
                bgClip="text"
              >
                {locale.hero.titleHighlight}
              </Text>
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" lineHeight="1.7">
              {locale.hero.subtitle}
              <ChakraLink
                href={locale.hero.subtitleLinkUrl}
                target="_blank"
                color="fg"
                textDecoration="underline"
                textDecorationColor="border.emphasized"
                _hover={{ textDecorationColor: 'fg' }}
              >
                {locale.hero.subtitleLink}
              </ChakraLink>
              {locale.hero.subtitleEnd}
            </Text>
            <Stack direction="row" gap={3} pt={2}>
              {user ? (
                <Button
                  size="lg"
                  bg="fg"
                  color="bg"
                  _hover={{ opacity: 0.9 }}
                  onClick={() => {
                    window.location.href = '/workspace';
                  }}
                >
                  {locale.hero.ctaWorkspace}
                  <LuArrowRight />
                </Button>
              ) : (
                <Button size="lg" bg="fg" color="bg" _hover={{ opacity: 0.9 }} asChild>
                  <ChakraLink href="#pricing">
                    {locale.hero.ctaPrimary}
                    <LuArrowRight />
                  </ChakraLink>
                </Button>
              )}
              <Button size="lg" variant="ghost" asChild>
                <ChakraLink href="#features">{locale.hero.ctaSecondary}</ChakraLink>
              </Button>
            </Stack>
          </Stack>

          <Box
            flex={1}
            w="full"
            maxW={{ lg: '560px' }}
            borderRadius="xl"
            overflow="hidden"
            borderWidth="1px"
            borderColor="border"
            shadow="lg"
          >
            <ThemedImage
              lightSrc={boardScreenshotLight}
              darkSrc={boardScreenshotDark}
              w="full"
              display="block"
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
