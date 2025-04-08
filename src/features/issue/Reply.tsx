import { Box, ButtonGroup, Flex, IconButton, MenuPositioner, Portal, Text } from '@chakra-ui/react';
import { db } from '@/instantdb.ts';
import { UserAvatar } from '@/components/Avatars.tsx';
import { timeAgo } from '@/utils/dates.ts';
import { id as generateInstantId } from '@instantdb/react';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu.tsx';
import { LuEllipsisVertical, LuTrash2 } from 'react-icons/lu';
import { ConfirmAction } from '@/components/ConfirmAction.tsx';
import { runTransaction } from '@/core/instantdb-transaction.ts';

interface IProps {
  id: string;
  date: Date | string;
  content: string;
  userEmail: string;
}

export const Reply = ({ id, date, userEmail, content }: IProps) => {
  return (
    <Box>
      <Flex gap="3" alignItems="flex-start" mb="2">
        <Box mt="3px">
          {/* TODO: генерация id() оверхед */}
          <UserAvatar size="sm" user={{ userId: generateInstantId(), userEmail: userEmail }} />
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
            {userEmail}
          </Text>

          <Text color="fg.subtle" fontSize="sm">
            {timeAgo(date)}
          </Text>
        </Box>

        <Box ml="auto">
          <MenuRoot positioning={{ placement: 'right-start' }}>
            <MenuTrigger asChild>
              <ButtonGroup size="2xs" variant="surface">
                <IconButton>
                  <LuEllipsisVertical />
                </IconButton>
              </ButtonGroup>
            </MenuTrigger>

            <Portal>
              <MenuPositioner>
                <MenuContent>
                  <ConfirmAction
                    opener={
                      <MenuItem value="delete" color="red.solid">
                        <LuTrash2 /> Delete
                      </MenuItem>
                    }
                    text="Are you sure you want to delete reply?"
                    onOk={() => {
                      runTransaction(() => deleteReply({ replyId: id }));
                    }}
                  />
                </MenuContent>
              </MenuPositioner>
            </Portal>
          </MenuRoot>
        </Box>
      </Flex>

      {/* TODO: editable */}
      <Text fontSize="sm">{content}</Text>
    </Box>
  );
};

async function deleteReply({ replyId }: { replyId: string }) {
  return await db.transact([db.tx.replies[replyId].delete()]);
}

// async function updateReplyContent({ newContent, replyId }: { newContent: string; replyId: string }) {
//   return await db.transact([db.tx.replies[replyId].merge({ content: newContent })]);
// }
