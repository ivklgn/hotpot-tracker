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
import { db } from '../../../../../instantdb';
import { useAccount } from '../../../../../features/account/AccountContext';
import { id } from '@instantdb/react';
import { runMutation } from '../../../../../features/core/instantdb-mutation';

interface CreateTeamDialogProps {
  opener: React.ReactElement;
}

export const InviteMemberDialog: React.FC<CreateTeamDialogProps> = ({ opener }) => {
  const ref = useRef<HTMLInputElement>(null);
  const { currentTeamId } = useAccount();
  const { user } = db.useAuth();
  const { data: memberships } = db.useQuery({
    memberships: {
      $: {
        where: {
          'teams.id': currentTeamId as string,
        },
      },
    },
  });
  const { data: currentTeam } = db.useQuery({ teams: { $: { where: { id: currentTeamId as string } } } });
  const [isVisible, setVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (memberships?.memberships.find((m) => m.userEmail === email)) {
      setError('User already invited');
      return;
    }

    runMutation(() =>
      inviteMember({
        teamId: currentTeamId as string,
        userEmail: email,
        teamName: currentTeam?.teams?.[0]?.name as string,
        creatorId: user?.id as string,
      })
    );

    setEmail('');
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
            <DialogTitle>Invite user by email</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Field invalid={!!error} errorText={error}>
              <Input
                ref={ref}
                placeholder="user@mail.com"
                value={email}
                onChange={(e) => {
                  setError(null);
                  setEmail(e.target.value);
                }}
                required
                type="email"
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
            <Button type="submit">Send</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

async function inviteMember({
  teamId,
  userEmail,
  teamName,
  creatorId,
}: {
  teamId: string;
  userEmail: string;
  teamName: string;
  creatorId?: string;
}) {
  const inviteId = id();
  const membershipId = id();

  return await db.transact([
    db.tx.memberships[membershipId].update({ teamId, userEmail, creatorId }),
    db.tx.memberships[membershipId].link({ teams: teamId }),
    db.tx.invites[inviteId].update({
      userEmail,
      teamId,
      teamName,
      status: 'pending',
      membershipId,
      creatorId,
    }),
    db.tx.invites[inviteId].link({ teams: teamId }),
  ]);
}
