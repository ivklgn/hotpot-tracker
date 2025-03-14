import { Input } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { cloneElement, useRef, useState } from 'react';
import React from 'react';
import { db } from '../../instantdb';
import { id } from '@instantdb/react';
import { useAccount } from '../account/AccountContext';
import { useLocation } from 'wouter';
import { runTransaction } from '../../core/instantdb-transaction';

interface CreateTeamDialogProps {
  opener: React.ReactElement;
}

export const CreateBoardDialog: React.FC<CreateTeamDialogProps> = ({ opener }) => {
  const [, navigate] = useLocation();
  const ref = useRef<HTMLInputElement>(null);
  const [isVisible, setVisibility] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { currentTeamId } = useAccount();
  const { user } = db.useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    runTransaction(() => createBoard({ name, teamId: currentTeamId as string, creatorId: user?.id })).then(
      (newBoardId) => {
        navigate(`/board/${newBoardId}`);
      }
    );
    setName('');
    setVisibility(false);
    setError(null);
  };

  return (
    <DialogRoot initialFocusEl={() => ref.current} open={isVisible}>
      <DialogTrigger asChild>
        {cloneElement(opener, {
          ref,
          onClick: () => {
            setVisibility(true);
          },
        })}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new board</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Field invalid={!!error} errorText={error}>
              <Input
                ref={ref}
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setError(null);
                  setName(e.target.value);
                }}
                required
                type="text"
                minLength={1}
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setVisibility(false);
                }}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

async function createBoard({
  name,
  teamId,
  creatorId,
}: {
  name: string;
  teamId: string;
  creatorId?: string;
}) {
  const boardId = id();
  await db.transact([
    db.tx.boards[boardId]
      .update({ name, teamId, creatorId, createdAt: new Date().toJSON() })
      .link({ teams: teamId }),
  ]);
  return boardId;
}
