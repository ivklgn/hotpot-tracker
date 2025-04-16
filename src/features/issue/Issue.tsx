import {
  Box,
  ButtonGroup,
  Editable,
  Em,
  Flex,
  IconButton,
  MenuPositioner,
  Portal,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import { timeAgo } from '@/utils/dates.ts';
import { LuBadgeCheck, LuCheck, LuEllipsisVertical, LuReply, LuX } from 'react-icons/lu';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu.tsx';
import tariffLimits from '../../../tariff-limits.json';
import { runTransaction } from '@/core/instantdb-transaction.ts';
import { ConfirmAction } from '@/components/ConfirmAction.tsx';
import { db } from '@/instantdb.ts';
import { UserAvatar } from '@/components/Avatars.tsx';
import { id } from '@instantdb/react';
import { Reply } from '@/features/issue/Reply.tsx';
import { toaster } from '../../components/ui/toaster';
import { useAccount } from '../account/AccountContext';

import './Issue.css';

interface IIssueProps {
  id: string;
  date: Date | string;
  content: string;
  onApprove(id: string): void;
}

export const Issue = ({ id, date, content, onApprove }: IIssueProps) => {
  const [issueContent, setIssueContent] = useState(content);
  const [replyContent, setReplyContent] = useState('');
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);
  const { currentTeamId } = useAccount();

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
      () =>
        createNewReply({
          issueId: id,
          content: replyContent,
          userEmail: user?.email as string,
          teamId: currentTeamId as string,
          creatorId: user?.id as string,
        }),
      (result) => {
        if (result.isOk()) {
          setReplyContent('');
          return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (result.isErr() && result.error.originalError?.hint?.expected === 'perms-pass?') {
          toaster.create({
            title: `Maximum ${tariffLimits.free.max_replies_per_issue} replies allowed`,
            type: 'error',
          });
        }
      }
    );
  };

  const handleMouseEnter = () => {
    setIsActionBarVisible(true);
  };

  const handleMouseLeave = () => {
    setIsActionBarVisible(false);
  };

  const handleApproveIssue = () => {
    runTransaction(
      () => deleteIssue({ issueId: id }),
      (result) => {
        if (result.isOk()) {
          onApprove(id);
          return;
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
    <Box
      id={id}
      boxShadow="sm"
      width="full"
      onClick={handleClick}
      borderRadius="l3"
      overflow="hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {editorIssueQuote && (
        <Box
          px="1.5"
          borderWidth="1px"
          borderColor="border.disabled"
          borderBottomWidth={0}
          bg={{ _light: 'gray.100', _dark: 'gray.800' }}
        >
          <Button
            variant="plain"
            color={{ _light: 'gray.500', _dark: 'gray.400' }}
            size="2xs"
            _hover={{ color: { _light: 'teal.800', _dark: 'white' } }}
          >
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
              width={isActionBarVisible ? 190 : 265}
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

          {isActionBarVisible && (
            <Box ml="auto">
              <ButtonGroup size="2xs" variant="ghost">
                <ConfirmAction
                  opener={
                    <IconButton colorPalette="green">
                      <LuBadgeCheck />
                    </IconButton>
                  }
                  text="Are you sure you want to approve issue?"
                  onOk={handleApproveIssue}
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
                          text="Are you sure you want to resolve this issue?"
                          onOk={handleApproveIssue}
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
          )}
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
            borderColor="border.emphasized"
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

        <Stack>
          {replies?.replies &&
            replies.replies.map((reply) => (
              <Box ml="6" mt="4" key={reply.id}>
                <Reply
                  date={`${reply.createdAt}`}
                  id={reply.id}
                  userEmail={reply.userEmail}
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
  return await db.transact([db.tx.issues[issueId].delete()]);
}

async function updateIssueContent({ newContent, issueId }: { newContent: string; issueId: string }) {
  return await db.transact([db.tx.issues[issueId].merge({ content: newContent })]);
}

async function createNewReply({
  issueId,
  content,
  userEmail,
  teamId,
  creatorId,
}: {
  issueId: string;
  content: string;
  userEmail: string;
  teamId: string;
  creatorId: string;
}) {
  const newReplyId = id();

  return await db.transact([
    db.tx.replies[newReplyId].update({
      issueId,
      content,
      userEmail,
      createdAt: new Date().toJSON(),
      teamId,
      creatorId,
    }),
    db.tx.replies[newReplyId].link({ issues: issueId }),
    db.tx.replies[newReplyId].link({ teams: teamId }),
  ]);
}
