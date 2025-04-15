import { Issue } from '@/features/issue/Issue.tsx';
import { calculateHeight, TASK_ISSUES_ID } from '@/features/issue/utils.ts';
import { Box, Flex } from '@chakra-ui/react';
import { db } from '@/instantdb.ts';
import { useParams } from 'wouter';
import { useLayoutEffect, useRef, useState } from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { runTransaction } from '@/core/instantdb-transaction.ts';
import { updateTaskContent } from '@/features/task/Task.tsx';

export const IssueList = () => {
  const { editor } = useCurrentEditor();
  const rootRef = useRef<HTMLDivElement>(null);
  const [rootHeight, setRootHeight] = useState('unset');

  const params = useParams();
  const { data: issues, isLoading } = db.useQuery({
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

  // useEffect(() => {
  //   if (!state.activeIssueId) return;
  //
  //   if (state.activeIssueId) {
  //     focusCommentWithActiveId(TASK_ISSUES_ID, state.activeIssueId as string);
  //   }
  // }, [state.activeIssueId]);

  useLayoutEffect(() => {
    if (isLoading) {
      return;
    }

    setRootHeight(calculateHeight(rootRef.current, '1.5rem'));
  }, [isLoading]);

  if (!issues?.issues.length) {
    return null;
  }

  const handleApproveIssue = (id: string) => {
    if (!editor) {
      return;
    }

    editor.commands.unsetComment(id);
    runTransaction(() =>
      updateTaskContent({ taskId: params.taskId as string, newContent: JSON.stringify(editor.getJSON()) })
    );
  };

  return (
    <Box
      id={TASK_ISSUES_ID}
      minWidth={340}
      maxWidth={360}
      width="full"
      maxHeight={rootHeight}
      overflowY="auto"
      ref={rootRef}
      position="relative"
    >
      <Flex gap="5" direction="column">
        {issues.issues.map((issue) => (
          <Issue
            onApprove={handleApproveIssue}
            id={issue.id}
            date={issue.createdAt.toString()}
            key={issue.id}
            content={issue.content}
          />
        ))}
      </Flex>

      <Box
        mx="-1px"
        bg="gray.200"
        position="sticky"
        bottom="-8px"
        right="0"
        left="0"
        w="full"
        h="30px"
        style={{ background: 'linear-gradient(0deg,#fff 39.58%,hsla(0,0%,100%,0))' }}
      />
    </Box>
  );
};
