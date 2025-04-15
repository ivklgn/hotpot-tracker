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

interface IProps {
  taskId: string;
  opener: ReactElement;
}

export function CreateIssueDialog({ taskId, opener }: IProps) {
  const openerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  const { editor } = useCurrentEditor();
  const { user } = db.useAuth();
  const params = useParams();

  const handleReset = () => {
    setContent('');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const setIssue = () => {
    const newIssueId = id();

    runTransaction(
      () => createNewIssue({ issueId: newIssueId, taskId, content, creatorId: user?.id }),
      (result) => {
        if (result.isOk() && editor) {
          editor.commands.setComment(newIssueId);
          handleSubmit();
        }

        // TODO: perms + tariffLimits
        // if (result.isErr() && result.error.originalError?.hint?.expected === 'perms-pass?') {
        //   toaster.create({
        //     title: `Maximum ${tariffLimits.free.max_issues_per_tasks} issues allowed`,
        //     type: 'error',
        //   });
        // }
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
      (result) => {
        if (result.isOk()) {
          handleClose();
          handleReset();
        }
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
  issueId,
  taskId,
  content,
  creatorId,
}: {
  issueId: string;
  content: string;
  taskId: string;
  creatorId?: string;
}) {
  return await db.transact([
    db.tx.issues[issueId].update({
      taskId,
      content,
      creatorId,
      createdAt: new Date().toJSON(),
    }),
    db.tx.issues[issueId].link({ tasks: taskId }),
  ]);
}
