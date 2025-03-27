import { DialogCloseTrigger, Input } from '@chakra-ui/react';
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
import { runTransaction } from '../../core/instantdb-transaction';
import { toaster } from '../../components/ui/toaster';
import tariffLimits from '../../../tariff-limits.json';

interface CreateTeamDialogProps {
  opener?: React.ReactElement;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({ opener, isOpen, onClose }) => {
  const ref = useRef<HTMLInputElement>(null);
  const { user } = db.useAuth();
  const [teamName, setTeamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    runTransaction(
      () =>
        createTeamWithMember({
          teamName,
          userEmail: user?.email as string,
          userId: user?.id as string,
          creatorId: user?.id,
        }),
      (result) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (result.isErr() && result.error.originalError?.hint?.expected === 'perms-pass?') {
          toaster.create({
            title: `Maximum ${tariffLimits.free.max_teams_per_account} teams allowed`,
            type: 'error',
          });
        }
      }
    );

    setTeamName('');
    onClose?.();
  };

  return (
    <DialogRoot initialFocusEl={() => ref.current} open={isOpen}>
      {opener && (
        <DialogTrigger asChild>
          {cloneElement(opener, {
            ref,
          })}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogCloseTrigger onClick={() => onClose?.()} />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new Team</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Field label="Last Name">
              <Input
                ref={ref}
                placeholder="Team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                type="text"
                minLength={1}
                maxLength={20}
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  onClose?.();
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

async function createTeamWithMember({
  teamName,
  userEmail,
  userId,
  creatorId,
}: {
  teamName: string;
  userEmail: string;
  userId: string;
  creatorId?: string;
}) {
  const teamId = id();
  const membershipId = id();

  const result = await db.transact([
    db.tx.teams[teamId].update({
      updatedAt: new Date().toJSON(),
      name: teamName,
      creatorId,
      createdAt: new Date().toJSON(),
    }),
    db.tx.teams[teamId].link({ users: userId }),
    db.tx.memberships[membershipId].update({
      updatedAt: new Date().toJSON(),
      teamId,
      userId,
      creatorId,
      userEmail,
    }),
    db.tx.memberships[membershipId].link({ teams: teamId }),
  ]);

  return {
    result,
    vars: {
      teamId,
      membershipId,
    },
  };
}
