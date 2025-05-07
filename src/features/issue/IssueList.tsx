import { Issue } from '@/features/issue/Issue.tsx';
import { calculateHeight, TASK_ISSUES_ID } from '@/features/issue/utils.ts';
import { Box, Flex } from '@chakra-ui/react';
import { db } from '@/instantdb.ts';
import { useParams } from 'wouter';
import { useLayoutEffect, useRef, useState } from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { runTransaction } from '@/core/instantdb-transaction.ts';
import { updateTaskContent } from '@/features/task/Task.tsx';
import { toaster } from '../../utils/toaster';

export const IssueList = () => {
  const { editor } = useCurrentEditor();
  const rootRef = useRef<HTMLDivElement>(null);
  const [rootHeight, setRootHeight] = useState('unset');
  const params = useParams();
  const { data: issues, isLoading } = db.useQuery({
    issues: {
      memberships: {},
      replies: {
        memberships: {},
      },
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

  useLayoutEffect(() => {
    if (isLoading) {
      return;
    }

    setRootHeight(calculateHeight(rootRef.current, '1.5rem'));
  }, [isLoading]);

  if (!issues?.issues.length) {
    return null;
  }

  const handleApproveIssue = (issueId: string) => {
    if (!editor) {
      return;
    }

    editor.commands.unsetComment(issueId);
    runTransaction(
      () =>
        updateTaskContent({ taskId: params.taskId as string, newContent: JSON.stringify(editor.getJSON()) }),
      () => {
        toaster.create({
          title: 'Task saved',
          type: 'success',
        });
      }
    );
  };

  return (
    <Box
      id={TASK_ISSUES_ID}
      minWidth={340}
      maxWidth={360}
      width="full"
      height={rootHeight}
      overflowY="auto"
      ref={rootRef}
      position="relative"
    >
      <Flex gap="5" direction="column">
        {issues.issues.map((issue) => (
          <Issue
            userEmail={issue.memberships?.userEmail as string}
            creatorId={issue.creatorId}
            onApprove={handleApproveIssue}
            id={issue.id}
            date={issue.createdAt.toString()}
            key={issue.id}
            content={issue.content}
            replies={issue?.replies}
          />
        ))}
      </Flex>

      <Box
        mx="-1px"
        position="sticky"
        bottom="-8px"
        right="0"
        left="0"
        w="full"
        h="30px"
        bgGradient={{
          _light: 'linear-gradient(0deg, #fff 39.58%, hsla(0,0%,100%,0))',
          _dark: 'none',
        }}
      />
    </Box>
  );
};
