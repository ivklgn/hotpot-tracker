import { useCompletion } from '@ai-sdk/react';
import {
  Text,
  Button,
  Drawer,
  Portal,
  Spinner,
  CloseButton,
  Box,
  HStack,
  Icon,
  RadioCard,
} from '@chakra-ui/react';
import { LuArrowRight, LuCircleOff, LuLock, LuWand } from 'react-icons/lu';
import { db } from '../../instantdb';

const items = [
  {
    icon: <LuArrowRight />,
    value: 'allow',
    title: 'Allow',
    description: 'This user can access the system',
  },
  {
    icon: <LuCircleOff />,
    value: 'deny',
    title: 'Deny',
    description: 'This user will be denied access to the system',
  },
  {
    icon: <LuLock />,
    value: 'lock',
    title: 'Lock',
    description: 'This user will be locked out of the system',
  },
];

interface AIReport {
  boardId: string;
}

export function AIReport({ boardId }: AIReport) {
  const { user } = db.useAuth();
  const { completion, handleSubmit, isLoading, stop } = useCompletion({
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
                {!completion && (
                  <>
                    <RadioCard.Root defaultValue="allow" mb={4}>
                      <RadioCard.Label>Select preset:</RadioCard.Label>
                      <HStack align="stretch">
                        {items.map((item) => (
                          <RadioCard.Item key={item.value} value={item.value}>
                            <RadioCard.ItemHiddenInput />
                            <RadioCard.ItemControl>
                              <RadioCard.ItemContent>
                                <Icon fontSize="2xl" color="fg.muted" mb="2">
                                  {item.icon}
                                </Icon>
                                <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                                <RadioCard.ItemDescription>{item.description}</RadioCard.ItemDescription>
                              </RadioCard.ItemContent>
                              <RadioCard.ItemIndicator />
                            </RadioCard.ItemControl>
                          </RadioCard.Item>
                        ))}
                      </HStack>
                    </RadioCard.Root>
                    <Button variant="solid" mb="4" type="submit" colorScheme="blue" disabled={isLoading}>
                      <LuWand /> start
                    </Button>
                    <Box mb="4">
                      <Text fontWeight="light">Press start to generate an AI report for this board</Text>
                    </Box>
                  </>
                )}
              </form>
              {completion && (
                <>
                  <Button
                    variant="solid"
                    mb="4"
                    colorScheme="blue"
                    onClick={() => {
                      stop();
                    }}
                  >
                    <LuWand /> rr
                  </Button>
                  <Box whiteSpace="pre-wrap">
                    <Text fontWeight="light">{completion}</Text>
                  </Box>
                </>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
