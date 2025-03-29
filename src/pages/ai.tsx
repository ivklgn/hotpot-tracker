import { useCompletion } from '@ai-sdk/react';
import { Box, Container, Input, VStack, Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { db } from '../instantdb';

export function AIPage() {
  const { user } = db.useAuth();
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: `${import.meta.env.VITE_AI_BACKEND_API_URL}/api/ai-report`,
    headers: {
      refresh_token: user?.refresh_token as string,
    },
  });

  return (
    <Container maxW="md" p={4}>
      <form onSubmit={handleSubmit}>
        <VStack gap={4}>
          <Input
            value={input}
            placeholder="Напиши что-нибудь (не используется)"
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            disabled={isLoading}
            loading={isLoading}
            loadingText="Загрузка..."
          >
            Отправить
          </Button>
        </VStack>
      </form>
      <Box mt={6} p={4} bg="gray.100" borderRadius="md" whiteSpace="pre-wrap">
        <Text>{completion}</Text>
      </Box>
    </Container>
  );
}
