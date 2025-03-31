import { useCompletion } from '@ai-sdk/react';
import { Text, Button, Drawer, Portal, Spinner, CloseButton, Box } from '@chakra-ui/react';
import { LuWand } from 'react-icons/lu';
import { db } from '../../instantdb';

interface AIReport {
  boardId: string;
}

export function AIReport({ boardId }: AIReport) {
  const { user } = db.useAuth();
  const { completion, handleSubmit, isLoading } = useCompletion({
    initialInput: '123',
    api: `${import.meta.env.VITE_AI_BACKEND_API_URL}/api/ai-report`,
    headers: {
      refresh_token: user?.refresh_token as string,
    },
    body: {
      boardId,
    },
  });

  return (
    <Drawer.Root size="lg">
      <Drawer.Trigger asChild>
        <Button variant="outline">
          <LuWand /> AI Report
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
            <Drawer.Header>
              <Drawer.Title>{isLoading && <Spinner size="xs" />} AI Report</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <form onSubmit={handleSubmit}>
                {!completion && [
                  <Box mb="4">
                    <Text fontWeight="light">Press start to generate an AI report for this board</Text>
                  </Box>,
                  <Button variant="solid" mb="4" type="submit" colorScheme="blue" disabled={isLoading}>
                    <LuWand /> start
                  </Button>,
                ]}
              </form>
              {completion && (
                <Box whiteSpace="pre-wrap">
                  <Text fontWeight="light">{completion}</Text>
                </Box>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
