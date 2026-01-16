import { Box, Container, HStack, Text, Link as ChakraLink } from '@chakra-ui/react';
import type { LandingLocale } from '../locales/types';

interface FooterSectionProps {
  readonly locale: LandingLocale;
}

export function FooterSection({ locale }: FooterSectionProps) {
  return (
    <Box py={6} borderTopWidth="1px" borderColor="border">
      <Container maxW="6xl">
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Text fontSize="sm" color="fg.muted">
            {locale.footer.copyright}
          </Text>
          <HStack gap={6}>
            <ChakraLink
              href="https://forms.gle/aCK2VbQ9pEAWfWSHA"
              target="_blank"
              fontSize="sm"
              color="fg.muted"
              _hover={{ color: 'fg' }}
            >
              {locale.footer.reportProblem}
            </ChakraLink>
            <ChakraLink
              href="https://www.ivklgn.blog/posts/hotpot-tracker/"
              target="_blank"
              fontSize="sm"
              color="fg.muted"
              _hover={{ color: 'fg' }}
            >
              {locale.footer.blog}
            </ChakraLink>
            <ChakraLink
              href="https://github.com/ivklgn/hotpot-tracker"
              target="_blank"
              fontSize="sm"
              color="fg.muted"
              _hover={{ color: 'fg' }}
            >
              {locale.footer.github}
            </ChakraLink>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
