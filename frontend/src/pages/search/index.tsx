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
  Heading,
  Badge,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { InputGroup } from '../../components/ui/input-group';
import { useState } from 'react';
import { db } from '../../instantdb';
import { useDebounce } from '../../hooks/useDebounce';
import { SmartParams } from '../../features/smart-params';
import { useAccount } from '../../features/account/AccountContext';
import Helm from '../../components/Helm';

export function SearchPage() {
  const { currentTeamId } = useAccount();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1500);
  const { data } = db.useQuery(
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
                title: { $ilike: `%${debouncedSearch}%` },
              },
              limit: 10,
            },
          },
          boards: {
            smartParams: {},
            $: {
              where: {
                teamId: currentTeamId as string,
                name: { $ilike: `%${debouncedSearch}%` },
              },
              limit: 10,
            },
          },
        }
      : null
  );

  const hasResults = (data?.tasks && data.tasks.length > 0) || (data?.boards && data.boards.length > 0);
  const hasNoResults = debouncedSearch && debouncedSearch.length >= 2 && !hasResults;

  return (
    <Box flex="1" pt={8} mx={6}>
      <Helm title="Search tasks and boards" />
      <InputGroup
        flex="1"
        startElement={search !== debouncedSearch ? <Spinner size="xs" /> : <LuSearch />}
        width="100%"
      >
        <Input
          placeholder="Search tasks and boards"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          maxLength={80}
        />
      </InputGroup>
      <Flex direction="column" pt="6" gap="2" overflowY="scroll">
        {!hasResults && (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuSearch />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>
                  {!debouncedSearch || debouncedSearch.length < 2 ? 'Search tasks and boards' : 'Not found'}
                </EmptyState.Title>
                <EmptyState.Description>
                  {hasNoResults
                    ? 'No matching tasks or boards found'
                    : 'Start searching by typing at least 2 characters'}
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        )}

        {hasResults && (
          <VStack gap={4} align="stretch" width="100%">
            {data?.tasks && data.tasks.length > 0 && (
              <Box>
                <Heading size="sm" mb={2}>
                  Tasks
                </Heading>
                <VStack gap={2} align="stretch">
                  {data.tasks.map((task) => (
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
                            <SmartParams
                              mode="view"
                              type="board-task"
                              smartParams={task.smartParams}
                              taskId={task.id}
                            />
                          )}
                          {task.deletedAt && (
                            <Badge colorPalette="red" variant="outline">
                              Archived
                            </Badge>
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
                </VStack>
              </Box>
            )}

            {data?.boards && data.boards.length > 0 && (
              <Box>
                <Heading size="sm" mb={2}>
                  Boards
                </Heading>
                <VStack gap={2} align="stretch">
                  {data.boards.map((board) => (
                    <Card.Root size="sm" key={board.id}>
                      <Card.Header>
                        <ChakraLink
                          href={`/board/${board.id}`}
                          colorPalette="teal"
                          fontWeight="medium"
                          fontSize="md"
                          target="_blank"
                        >
                          {board.name}
                        </ChakraLink>
                      </Card.Header>
                      <Card.Body color="fg.muted">
                        <HStack>
                          {board.smartParams && board.smartParams.length > 0 && (
                            <SmartParams
                              mode="view"
                              type="board"
                              smartParams={board.smartParams}
                              boardId={board.id}
                            />
                          )}
                          {board.deletedAt && (
                            <Badge colorPalette="red" variant="outline">
                              Archived
                            </Badge>
                          )}
                        </HStack>
                      </Card.Body>
                    </Card.Root>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        )}
      </Flex>
    </Box>
  );
}
