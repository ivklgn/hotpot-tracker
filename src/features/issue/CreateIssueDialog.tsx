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
import tariffLimits from '../../../tariff-limits.json';
import { useAccount } from '../account/AccountContext';
import { toaster } from '@/utils/toaster';
import { isInstantDBPermissionError } from '../../core/instantdb-errors';

interface IProps {
  taskId: string;
  opener?: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: () => void }>;
  visible?: boolean;
  onCreate?: () => void;
  onClose?: () => void;
}

export function CreateIssueDialog({ taskId, opener, visible = false, onCreate, onClose }: IProps) {
  const openerRef = useRef(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = visible || internalOpen;
  const [content, setContent] = useState('');

  const { editor } = useCurrentEditor();
  const { user } = db.useAuth();
  const userId = user?.id as string;

  const params = useParams();
  const { currentTeamId } = useAccount();
  const { data: memberships } = db.useQuery({
    memberships: {
      $: {
        where: {
          userId,
        },
        limit: 1,
      },
    },
  });

  const currentMembershipId = memberships?.memberships[0]?.id;

  const handleReset = () => {
    setContent('');
  };

  const handleClose = () => {
    setInternalOpen(false);
    onClose?.();
  };

  const handleSaveIssue = () => {
    if (!currentMembershipId) {
      return;
    }

    runTransaction(
      () =>
        createNewIssue({
          taskId,
          content,
          creatorId: userId,
          membershipId: currentMembershipId,
          teamId: currentTeamId as string,
        }),
      (newIssueId) => {
        if (editor) {
          editor.commands.setComment(newIssueId);
        }

        toaster.create({
          title: 'Issue created',
          type: 'success',
        });
        handleSubmit();
        onCreate?.();
        onClose?.();
      },
      (error) => {
        if (isInstantDBPermissionError(error)) {
          toaster.create({
            title: `Maximum ${tariffLimits.free.max_issues_per_tasks} issues allowed`,
            type: 'error',
          });
        }
      }
    );
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
        {opener &&
          cloneElement(opener, {
            ref: openerRef,
            onClick() {
              setInternalOpen((prev) => !prev);
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

export async function createNewIssue({
  taskId,
  content,
  creatorId,
  membershipId,
  teamId,
}: {
  content: string;
  taskId: string;
  creatorId: string;
  membershipId: string;
  teamId: string;
}) {
  const newIssueId = id();

  await db.transact([
    db.tx.issues[newIssueId].update({
      taskId,
      content,
      creatorId,
      membershipId,
      createdAt: new Date().toJSON(),
      teamId,
    }),
    db.tx.issues[newIssueId].link({ tasks: taskId }),
    db.tx.issues[newIssueId].link({ teams: teamId }),
    db.tx.issues[newIssueId].link({ memberships: membershipId }),
  ]);

  return newIssueId;
}
