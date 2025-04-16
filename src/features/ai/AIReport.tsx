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
import { LuInfo, LuUsersRound, LuWand } from 'react-icons/lu';
import { db } from '../../instantdb';
import { useState } from 'react';

const items = [
  {
    icon: <LuInfo />,
    value: 'basic',
    title: 'Basic',
    description: 'Basic overview of the board.',
  },
  {
    icon: <LuUsersRound />,
    value: 'team',
    title: 'Team',
    description: 'Detailed report of the team members and their contributions to the board.',
  },
];

interface AIReport {
  boardId: string;
}

export function AIReport({ boardId }: AIReport) {
  const [preset, setPreset] = useState('basic');
  const { user } = db.useAuth();
  const { completion, handleSubmit, isLoading, setCompletion, stop } = useCompletion({
    initialInput: '1',
    api: `${import.meta.env.VITE_BACKEND_API_URL}/api/ai-report`,
    headers: {
      refresh_token: user?.refresh_token as string,
    },
    body: {
      boardId,
      preset,
    },
  });

  const handleResetClick = () => {
    stop();
    setCompletion('');
  };

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
                    <RadioCard.Root defaultValue={preset} mb={4} value={preset}>
                      <RadioCard.Label>Select preset:</RadioCard.Label>
                      <HStack align="stretch">
                        {items.map((item) => (
                          <RadioCard.Item
                            key={item.value}
                            value={item.value}
                            onClick={() => {
                              setPreset(item.value);
                            }}
                          >
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
                  <Button variant="solid" mb="4" colorScheme="blue" onClick={handleResetClick}>
                    <LuWand /> Reset
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
