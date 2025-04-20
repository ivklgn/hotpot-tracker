import { Box, ButtonGroup, Flex, IconButton, Stack, Textarea } from '@chakra-ui/react';
import { LuCheck } from 'react-icons/lu';
import { Ref, useState } from 'react';
import { runTransaction } from '@/core/instantdb-transaction.ts';
import tariffLimits from '../../../tariff-limits.json';
import { id, InstaQLResult } from '@instantdb/react';
import { db } from '@/instantdb.ts';
import { Reply } from '@/features/issue/Reply.tsx';
import { useAccount } from '@/features/account/AccountContext.tsx';
import { AppSchema } from '../../../instant.schema';
import { toaster } from '@/utils/toaster';

interface IProps {
  issueId: string;
  fieldRef: Ref<HTMLTextAreaElement>;
  replies?: InstaQLResult<AppSchema, { replies: { memberships: {} } }>['replies'];
}

export const IssueReplies = ({ issueId, fieldRef, replies }: IProps) => {
  const [replyContent, setReplyContent] = useState('');
  const { user } = db.useAuth();
  const { currentTeamId } = useAccount();
  const { data: memberships } = db.useQuery({
    memberships: {
      $: {
        where: {
          userId: user?.id as string,
          teamId: currentTeamId as string,
        },
      },
    },
  });
  const currentMembershipId = memberships?.memberships[0]?.id;

  const handleReplySubmit = () => {
    runTransaction(
      () =>
        createNewReply({
          issueId,
          content: replyContent,
          membershipId: currentMembershipId as string,
          teamId: currentTeamId as string,
          creatorId: user?.id as string,
        }),
      () => {
        setReplyContent('');
      },
      (error) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (error.originalError?.hint?.expected === 'perms-pass?') {
          toaster.create({
            title: `Maximum ${tariffLimits.free.max_replies_per_issue} replies allowed`,
            type: 'error',
          });
        }
      }
    );
  };

  return (
    <>
      <Box>
        <Textarea
          ref={fieldRef}
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
        {replies &&
          replies.map((reply) => (
            <Box ml="4" mt="4" key={reply.id}>
              <Reply
                userEmail={reply.memberships?.userEmail as string}
                creatorId={reply.creatorId}
                date={`${reply.createdAt}`}
                id={reply.id}
                content={reply.content}
              />
            </Box>
          ))}
      </Stack>
    </>
  );
};

async function createNewReply({
  issueId,
  content,
  teamId,
  membershipId,
  creatorId,
}: {
  issueId: string;
  content: string;
  teamId: string;
  membershipId: string;
  creatorId: string;
}) {
  const newReplyId = id();

  return await db.transact(
    db.tx.replies[newReplyId]
      .update({
        issueId,
        content,
        createdAt: new Date().toJSON(),
        teamId,
        membershipId,
        creatorId,
      })
      .link({ issues: issueId })
      .link({ teams: teamId })
      .link({ memberships: membershipId })
  );
}
