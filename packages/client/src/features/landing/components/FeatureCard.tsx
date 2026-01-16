import { VStack, Heading, Text, Icon, Box } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

interface FeatureCardProps {
  readonly title: string;
  readonly text: string;
  readonly icon: IconType;
}

export function FeatureCard({ title, text, icon }: FeatureCardProps) {
  return (
    <VStack gap={3} align="start">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        w={10}
        h={10}
        rounded="lg"
        bg="bg.muted"
      >
        <Icon as={icon} boxSize={5} color="fg.muted" />
      </Box>
      <Heading fontSize="md" fontWeight={600}>
        {title}
      </Heading>
      <Text fontSize="sm" color="fg.muted" lineHeight="1.6">
        {text}
      </Text>
    </VStack>
  );
}
