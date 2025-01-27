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
import { useAction, useAtom } from '@reatom/npm-react';
import { fetchInviteMemberAtom } from './model';
import { currentTeamAtom } from '../../../../features/account/model';
import { userAtom } from '../../../../features/auth/model';

interface CreateTeamDialogProps {
  opener: React.ReactElement;
}

export const InviteMemberDialog: React.FC<CreateTeamDialogProps> = ({ opener }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [currentTeam] = useAtom(currentTeamAtom);
  const [isVisible, setVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const fetchInviteMember = useAction(fetchInviteMemberAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    fetchInviteMember({
      teamId: currentTeam?.id as string,
      userEmail: email,
      teamName: currentTeam?.name as string,
    });

    setEmail('');
    setVisibility(false);
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
            <Field label="Last Name">
              <Input
                ref={ref}
                placeholder="user@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
