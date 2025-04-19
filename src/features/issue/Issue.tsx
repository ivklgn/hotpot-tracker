import { Box, ButtonGroup, Editable, Em, Flex, IconButton, MenuPositioner, Portal } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { useRef, useState } from 'react';
import { timeAgo } from '@/utils/dates.ts';
import { LuBadgeCheck, LuCheck, LuEllipsisVertical, LuReply, LuX } from 'react-icons/lu';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu.tsx';
import { runTransaction } from '@/core/instantdb-transaction.ts';
import { ConfirmAction } from '@/components/ConfirmAction.tsx';
import { db } from '@/instantdb.ts';
import { UserAvatar } from '@/components/Avatars.tsx';
import { IssueReplies } from '@/features/issue/IssueReplies.tsx';
import { InstaQLResult } from '@instantdb/react';
import { AppSchema } from '../../../instant.schema';
import { toaster } from '../../components/ui/toaster';

import './Issue.css';

interface IIssueProps {
  id: string;
  creatorId: string;
  date: Date | string;
  content: string;
  userEmail: string;
  replies?: InstaQLResult<AppSchema, { replies: { memberships: {} } }>['replies'];
  onApprove(id: string): void;
}

export const Issue = ({ id, creatorId, userEmail, date, content, replies, onApprove }: IIssueProps) => {
  const replyFieldRef = useRef<HTMLTextAreaElement>(null);

  const [issueContent, setIssueContent] = useState(content);
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);

  const { user } = db.useAuth();

  const isCreator = creatorId === user?.id;
  const handleClick = () => {
    document.querySelectorAll('.highlight')?.forEach((el) => {
      el.classList.remove('highlight');
    });

    requestAnimationFrame(() => {
      const elementToHighlight = document.querySelector(`span[data-comment-id="${id}"]`);

      if (elementToHighlight) {
        elementToHighlight.classList.add('highlight');
      }
    });
  };

  const handleIssueContentUpdate = () => {
    runTransaction(() => updateIssueContent({ issueId: id, newContent: issueContent }));
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
      () => {
        onApprove(id);
        toaster.create({
          title: 'Issue approved, all replies deleted',
          type: 'success',
        });
        return;
      }
    );
  };

  const getIssueQuote = () => {
    const editorIssue = document.querySelector(`span[data-comment-id="${id}"]`);

    return editorIssue?.textContent;
  };
  const editorIssueQuote = getIssueQuote();

  if (!userEmail) {
    console.log('userEmail undefined');
    return null;
  }

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
            <UserAvatar size="sm" user={{ userId: creatorId, userEmail }} />
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
              {userEmail}
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

                <MenuRoot
                  positioning={{ placement: 'right-start' }}
                  onSelect={(details) => {
                    if (details.value === 'reply') {
                      requestAnimationFrame(() => {
                        replyFieldRef.current?.focus();
                      });
                    }
                  }}
                >
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
          onValueCommit={handleIssueContentUpdate}
          mb="4"
          textAlign="start"
          width="full"
          maxLength={200}
          disabled={!isCreator}
          defaultValue="Click to edit"
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

        <IssueReplies issueId={id} fieldRef={replyFieldRef} replies={replies} />
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
