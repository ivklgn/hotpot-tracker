import { Issue } from '@/features/issue/Issue.tsx';
import { TASK_ISSUES_ID } from '@/features/issue/utils.ts';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { db } from '@/instantdb.ts';
import { useParams } from 'wouter';

export const IssueList = () => {
  const params = useParams();
  console.log('params', params);
  const { data: issues } = db.useQuery({
    issues: {
      $: {
        where: {
          taskId: params?.taskId as string,
          deletedAt: {
            $isNull: true,
          },
        },
      },
    },
  });

  console.log('>> issues', issues);

  // useEffect(() => {
  //   if (!state.activeIssueId) return;
  //
  //   if (state.activeIssueId) {
  //     focusCommentWithActiveId(TASK_ISSUES_ID, state.activeIssueId as string);
  //   }
  // }, [state.activeIssueId]);

  if (!issues?.issues.length) {
    return null;
  }

  return (
    <Box id={TASK_ISSUES_ID} minWidth={340} maxWidth={360} width="full">
      <Heading size="2xl" mb="4">
        Issues:
      </Heading>

      <Flex gap="5" direction="column">
        {issues.issues.map((issue) => (
          <Issue id={issue.id} date={issue.createdAt.toString()} key={issue.id} content={issue.content} />
        ))}
      </Flex>
    </Box>
  );
};
