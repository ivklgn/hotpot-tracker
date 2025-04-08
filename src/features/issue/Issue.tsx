import {
  Box,
  ButtonGroup,
  Editable,
  Em,
  Flex,
  IconButton,
  MenuPositioner,
  Portal,
  Separator,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import { timeAgo } from '@/utils/dates.ts';
import { LuBadgeCheck, LuCheck, LuEllipsisVertical, LuReply, LuX } from 'react-icons/lu';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu.tsx';

import './Issue.css';
import { runTransaction } from '@/core/instantdb-transaction.ts';
import { ConfirmAction } from '@/components/ConfirmAction.tsx';
import { db } from '@/instantdb.ts';
import { UserAvatar } from '@/components/Avatars.tsx';
import { id } from '@instantdb/react';
import { Reply } from '@/features/issue/Reply.tsx';

// interface IIssuesContext {
//   issues: IIssue[];
//   activeIssueId: string | null;
// }
//
// export const { Provider: IssuesProvider, useAppContext: useIssuesContext } = createAppContext<IIssuesContext>(
//   {
//     issues: [],
//     activeIssueId: null,
//   }
// );

interface IIssueProps {
  id: string;
  date: Date | string;
  content: string;
}

export const Issue = ({ id, date, content }: IIssueProps) => {
  const [issueContent, setIssueContent] = useState(content);
  const [replyContent, setReplyContent] = useState('');

  const { user } = db.useAuth();
  const { data: replies } = db.useQuery({
    replies: {
      $: {
        where: {
          issueId: id,
        },
      },
    },
  });

  const handleClick = () => {
    document.querySelectorAll('.highlight')?.forEach((el) => {
      el.classList.remove('highlight');
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const elementToHighlight = document.querySelector(`span[data-comment-id="${id}"]`);

        if (elementToHighlight) {
          elementToHighlight.classList.add('highlight');
        }
      });
    });
  };

  const handleIssueContentChange = () => {
    runTransaction(() => updateIssueContent({ issueId: id, newContent: issueContent }));
  };

  const handleReplySubmit = () => {
    runTransaction(
      () => createNewReply({ issueId: id, content: replyContent, userEmail: user?.email }),
      (result) => {
        if (result.isOk()) {
          setReplyContent('');
        }
      }
    );
  };

  const getIssueQuote = () => {
    const editorIssue = document.querySelector(`span[data-comment-id="${id}"]`);

    return editorIssue?.textContent;
  };

  const editorIssueQuote = getIssueQuote();

  return (
    <Box id={id} boxShadow="xs" width="full" onClick={handleClick}>
      {editorIssueQuote && (
        <Box
          px="1.5"
          borderTopRadius="l3"
          borderWidth="1px"
          borderColor="border.disabled"
          borderBottomWidth={0}
          bg="bg.muted"
        >
          <Button variant="plain" color="fg.subtle" size="2xs" _hover={{ color: 'white' }}>
            <Em
              textStyle="xs"
              fontWeight="medium"
              maxWidth={320}
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              «{editorIssueQuote}»
            </Em>
          </Button>
        </Box>
      )}

      <Box px="5" pt="3" pb="4" borderWidth="1px" borderColor="border.disabled" borderBottomRadius="l3">
        <Flex gap="3" alignItems="flex-start" mb="4">
          <Box mt="3px">
            <UserAvatar size="sm" user={{ userId: user?.id as string, userEmail: user?.email as string }} />
          </Box>

          <Box>
            <Text
              color="gray.solid"
              fontSize="sm"
              fontWeight="bold"
              width={190}
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {user?.email}
            </Text>

            <Text color="fg.subtle" fontSize="sm">
              {timeAgo(date)}
            </Text>
          </Box>

          <Box ml="auto">
            <ButtonGroup size="2xs" variant="surface">
              <ConfirmAction
                opener={
                  <IconButton>
                    <LuBadgeCheck />
                  </IconButton>
                }
                text="Are you sure you want to approve issue?"
                onOk={() => {
                  runTransaction(() => deleteIssue({ issueId: id }));
                }}
              />

              <MenuRoot positioning={{ placement: 'right-start' }}>
                <MenuTrigger asChild>
                  <IconButton>
                    <LuEllipsisVertical />
                  </IconButton>
                </MenuTrigger>

                <Portal>
                  <MenuPositioner>
                    <MenuContent>
                      <ConfirmAction
                        opener={
                          <MenuItem value="approve">
                            <LuBadgeCheck /> Approve
                          </MenuItem>
                        }
                        text="Are you sure you want to delete issue?"
                        onOk={() => {
                          runTransaction(() => deleteIssue({ issueId: id }));
                        }}
                      />
                      <MenuItem value="reply">
                        <LuReply /> Reply
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>
            </ButtonGroup>
          </Box>
        </Flex>

        <Editable.Root
          activationMode="click"
          size="sm"
          value={issueContent}
          onValueChange={(e) => setIssueContent(e.value)}
          placeholder="Click to edit"
          onValueCommit={handleIssueContentChange}
          mb="4"
          textAlign="start"
          width="full"
          maxLength={200}
        >
          <Editable.Preview
            flexShrink="0"
            flexBasis="100%"
            fontSize="sm"
            color="gray.fg"
            wordBreak="break-word"
          />
          <Flex direction="column" gap="2" width="full">
            <Editable.Textarea width="full" fontSize="sm" color="gray.fg" />
            <Editable.Control justifyContent="flex-end">
              <Editable.CancelTrigger asChild>
                <IconButton variant="outline" size="xs">
                  <LuX />
                </IconButton>
              </Editable.CancelTrigger>
              <Editable.SubmitTrigger asChild>
                <IconButton variant="outline" size="xs">
                  <LuCheck />
                </IconButton>
              </Editable.SubmitTrigger>
            </Editable.Control>
          </Flex>
        </Editable.Root>

        <Box>
          <Textarea
            height="40px"
            placeholder="Reply to issue..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            size="sm"
          />

          {!!replyContent.length && (
            <Flex justifyContent="flex-end">
              <ButtonGroup variant="outline" size="xs">
                <IconButton onClick={handleReplySubmit}>
                  <LuCheck />
                </IconButton>
              </ButtonGroup>
            </Flex>
          )}
        </Box>

        <Separator mt="4" />

        <Stack>
          {replies?.replies &&
            replies.replies.map((reply) => (
              <Box ml="4" mt="4">
                <Reply
                  date={`${reply.createdAt}`}
                  id={reply.id}
                  userEmail={reply.userEmail}
                  key={reply.id}
                  content={reply.content}
                />
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
};

async function deleteIssue({ issueId }: { issueId: string }) {
  return await db.transact([db.tx.issues[issueId].update({ deletedAt: new Date().toJSON() })]);
}

async function updateIssueContent({ newContent, issueId }: { newContent: string; issueId: string }) {
  return await db.transact([db.tx.issues[issueId].merge({ content: newContent })]);
}

async function createNewReply({
  issueId,
  content,
  userEmail,
}: {
  issueId: string;
  content: string;
  userEmail?: string;
}) {
  const newReplyId = id();

  return await db.transact([
    db.tx.replies[newReplyId].update({
      issueId,
      content,
      userEmail,
      createdAt: new Date().toJSON(),
    }),
    db.tx.replies[newReplyId].link({ issues: newReplyId }),
  ]);
}
