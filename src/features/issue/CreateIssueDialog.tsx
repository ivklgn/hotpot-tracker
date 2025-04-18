import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { cloneElement, ReactElement, useRef, useState } from 'react';
import { Field, HStack, Textarea } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { useCurrentEditor } from '@tiptap/react';
import { id } from '@instantdb/react';
import { db } from '@/instantdb.ts';
import { runTransaction } from '@/core/instantdb-transaction.ts';
import { updateTaskContent } from '@/features/task/Task.tsx';
import { useParams } from 'wouter';
import { toaster } from '../../components/ui/toaster';
import tariffLimits from '../../../tariff-limits.json';
import { useAccount } from '../account/AccountContext';

interface IProps {
  taskId: string;
  opener: ReactElement;
  onCreate?: () => void;
}

export function CreateIssueDialog({ taskId, opener, onCreate }: IProps) {
  const openerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const { editor } = useCurrentEditor();
  const { user } = db.useAuth();
  const params = useParams();
  const { currentTeamId } = useAccount();

  const handleReset = () => {
    setContent('');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const setIssue = () => {
    runTransaction(
      () =>
        createNewIssue({
          taskId,
          content,
          creatorId: user?.id as string,
          teamId: currentTeamId as string,
          userEmail: user?.email as string,
        }),
      (result) => {
        if (editor) {
          editor.commands.setComment(result);
          handleSubmit();
          onCreate?.();
          return;
        }
      },
      (error) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (error.originalError?.hint?.expected === 'perms-pass?') {
          toaster.create({
            title: `Maximum ${tariffLimits.free.max_issues_per_tasks} issues allowed`,
            type: 'error',
          });
        }
      }
    );
  };

  const handleSaveIssue = () => {
    setIssue();
  };

  const handleSubmit = () => {
    if (!editor || !params.taskId) {
      return;
    }

    runTransaction(
      () =>
        updateTaskContent({ taskId: params.taskId as string, newContent: JSON.stringify(editor.getJSON()) }),
      () => {
        handleClose();
        handleReset();
      }
    );
  };

  return (
    <DialogRoot initialFocusEl={() => openerRef.current} open={isOpen} size="lg">
      <DialogTrigger>
        {cloneElement(opener, {
          openerRef,
          onClick() {
            setIsOpen((prev) => !prev);
          },
        })}
      </DialogTrigger>

      <DialogContent>
        <DialogCloseTrigger onClick={handleClose} />

        <DialogHeader>
          <DialogTitle>Enter the text of the issue</DialogTitle>
        </DialogHeader>

        <form>
          <DialogBody pb="4">
            <Field.Root>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comment..."
              />
              <Field.HelperText>Max 200 characters.</Field.HelperText>
            </Field.Root>
          </DialogBody>

          <DialogFooter justifyContent="flex-end">
            <HStack>
              <DialogActionTrigger asChild>
                <Button variant="outline" onClick={handleClose} size="xs">
                  Cancel
                </Button>
              </DialogActionTrigger>
              <Button size="xs" onClick={handleSaveIssue}>
                Save
              </Button>
            </HStack>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

async function createNewIssue({
  taskId,
  content,
  creatorId,
  teamId,
  userEmail,
}: {
  content: string;
  taskId: string;
  creatorId: string;
  teamId: string;
  userEmail: string;
}) {
  const newIssueId = id();

  await db.transact([
    db.tx.issues[newIssueId].update({
      taskId,
      content,
      creatorId,
      userEmail,
      createdAt: new Date().toJSON(),
      teamId,
    }),
    db.tx.issues[newIssueId].link({ tasks: taskId }),
    db.tx.issues[newIssueId].link({ teams: teamId }),
  ]);

  return newIssueId;
}
