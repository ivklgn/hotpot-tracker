import {
  Box,
  Card,
  EmptyState,
  Flex,
  Link as ChakraLink,
  Input,
  Spinner,
  VStack,
  HStack,
  Separator,
  Text,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { InputGroup } from '../../components/ui/input-group';
import { useState } from 'react';
import { db } from '../../instantdb';
import { useDebounce } from '../../hooks/useDebounce';
import { SmartParams } from '../../features/smart-params';
import { useAccount } from '../../features/account/AccountContext';

export function SearchPage() {
  const { currentTeamId } = useAccount();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);
  const { data: tasks } = db.useQuery(
    debouncedSearch && debouncedSearch.length >= 2
      ? {
          tasks: {
            smartParams: {},
            columns: {
              statuses: {},
            },
            $: {
              where: {
                teamId: currentTeamId as string,
                title: { $like: `%${debouncedSearch}%` },
                deletedAt: {
                  $isNull: true,
                },
              },
              limit: 10,
            },
          },
        }
      : null
  );

  return (
    <Box flex="1" pt={8} mx={6}>
      <InputGroup
        flex="1"
        startElement={search !== debouncedSearch ? <Spinner size="xs" /> : <LuSearch />}
        width="100%"
      >
        <Input
          placeholder="Search tasks"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </InputGroup>
      <Flex direction="column" pt="6" gap="2" overflowY="scroll">
        {(!tasks || tasks?.tasks.length === 0) && (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuSearch />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>{!tasks ? 'Search tasks' : 'Not found'}</EmptyState.Title>
                <EmptyState.Description>Start search tasks by title</EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        )}
        {tasks?.tasks &&
          tasks.tasks.map((task) => (
            <Card.Root size="sm" key={task.id}>
              <Card.Header>
                <ChakraLink
                  href={`/task/${task.id}`}
                  colorPalette="teal"
                  fontWeight="medium"
                  fontSize="md"
                  target="_blank"
                >
                  {task.title}
                </ChakraLink>
              </Card.Header>
              <Card.Body color="fg.muted">
                <HStack>
                  {task.smartParams && task.smartParams.length > 0 && (
                    <SmartParams type="board-task" smartParams={task.smartParams} taskId={task.id} />
                  )}
                  {task.columns ? (
                    [
                      <ChakraLink
                        href={`/board/${task.columns.boardId}`}
                        colorPalette="teal"
                        fontWeight="medium"
                        fontSize="xs"
                        target="_blank"
                      >
                        Go to board
                      </ChakraLink>,
                      <Separator orientation="vertical" height="4" />,
                      <Text textStyle="xs">
                        Column: <strong>{task.columns.statuses?.name}</strong>
                      </Text>,
                    ]
                  ) : (
                    <Text textStyle="xs">No board & column</Text>
                  )}
                </HStack>
              </Card.Body>
            </Card.Root>
          ))}
      </Flex>
    </Box>
  );
}
