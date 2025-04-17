import { Box, ButtonGroup, Editable, Flex, IconButton, Text } from '@chakra-ui/react';
import { UserAvatar } from '@/components/Avatars.tsx';
import { timeAgo } from '@/utils/dates.ts';
import { LuCheck, LuTrash2, LuX } from 'react-icons/lu';
import { useState } from 'react';
import { db } from '@/instantdb';
import { runTransaction } from '@/core/instantdb-transaction.ts';
import { ConfirmAction } from '@/components/ConfirmAction.tsx';

interface IProps {
  id: string;
  date: Date | string;
  content: string;
  userEmail: string;
  creatorId: string;
}

export const Reply = ({ id, creatorId, date, userEmail, content }: IProps) => {
  const [replyContent, setReplyContent] = useState(content);
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);

  const { user } = db.useAuth();

  const isCreator = creatorId === user?.id;

  const handleMouseEnter = () => {
    setIsActionBarVisible(true);
  };

  const handleMouseLeave = () => {
    setIsActionBarVisible(false);
  };

  const handleReplyContentUpdate = () => {
    runTransaction(() =>
      updateReplyContent({
        replyId: id,
        newContent: replyContent,
      })
    );
  };

  const handleDeleteReply = () => {
    runTransaction(() => deleteReply({ replyId: id }));
  };

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Flex gap="3" alignItems="flex-start" mb="2">
        <Box mt="3px">
          <UserAvatar size="sm" user={{ userId: creatorId, userEmail: userEmail }} />
        </Box>

        <Box>
          <Text
            color="gray.solid"
            fontSize="sm"
            fontWeight="bold"
            width={isActionBarVisible && isCreator ? 180 : 245}
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

        {isActionBarVisible && isCreator && (
          <Box ml="auto">
            <ButtonGroup size="2xs" variant="ghost">
              <ConfirmAction
                opener={
                  <IconButton colorPalette="red">
                    <LuTrash2 />
                  </IconButton>
                }
                text="Are you sure you want to delete reply?"
                onOk={handleDeleteReply}
              />
            </ButtonGroup>
          </Box>
        )}
      </Flex>

      <Editable.Root
        activationMode="click"
        size="sm"
        value={replyContent}
        onValueChange={(e) => setReplyContent(e.value)}
        placeholder="Click to edit"
        onValueCommit={handleReplyContentUpdate}
        textAlign="start"
        width="full"
        maxLength={200}
        disabled={!isCreator}
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
    </Box>
  );
};

async function deleteReply({ replyId }: { replyId: string }) {
  return await db.transact([db.tx.replies[replyId].delete()]);
}

async function updateReplyContent({ newContent, replyId }: { newContent: string; replyId: string }) {
  return await db.transact([db.tx.replies[replyId].merge({ content: newContent })]);
}
