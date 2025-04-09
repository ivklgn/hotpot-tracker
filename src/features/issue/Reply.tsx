import { Box, ButtonGroup, Flex, IconButton, Text } from '@chakra-ui/react';
import { db } from '@/instantdb.ts';
import { UserAvatar } from '@/components/Avatars.tsx';
import { timeAgo } from '@/utils/dates.ts';
import { id as generateInstantId } from '@instantdb/react';
import { LuPencilLine, LuTrash2 } from 'react-icons/lu';
import { useState } from 'react';

interface IProps {
  id: string;
  date: Date | string;
  content: string;
  userEmail: string;
}

export const Reply = ({ id, date, userEmail, content }: IProps) => {
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsActionBarVisible(true);
  };

  const handleMouseLeave = () => {
    setIsActionBarVisible(false);
  };

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
            width={isActionBarVisible ? 180 : 245}
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
              <IconButton>
                <LuPencilLine />
              </IconButton>

              <IconButton colorPalette="red">
                <LuTrash2 />
              </IconButton>
            </ButtonGroup>

            {/*<MenuRoot positioning={{ placement: 'right-start' }}>*/}
            {/*  <MenuTrigger asChild>*/}
            {/*    <ButtonGroup size="2xs" variant="surface">*/}
            {/*      <IconButton>*/}
            {/*        <LuEllipsisVertical />*/}
            {/*      </IconButton>*/}
            {/*    </ButtonGroup>*/}
            {/*  </MenuTrigger>*/}

            {/*  <Portal>*/}
            {/*    <MenuPositioner>*/}
            {/*      <MenuContent>*/}
            {/*        <ConfirmAction*/}
            {/*          opener={*/}
            {/*            <MenuItem value="delete" color="red.solid">*/}
            {/*              <LuTrash2 /> Delete*/}
            {/*            </MenuItem>*/}
            {/*          }*/}
            {/*          text="Are you sure you want to delete reply?"*/}
            {/*          onOk={() => {*/}
            {/*            runTransaction(() => deleteReply({ replyId: id }));*/}
            {/*          }}*/}
            {/*        />*/}
            {/*      </MenuContent>*/}
            {/*    </MenuPositioner>*/}
            {/*  </Portal>*/}
            {/*</MenuRoot>*/}
          </Box>
        )}
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
