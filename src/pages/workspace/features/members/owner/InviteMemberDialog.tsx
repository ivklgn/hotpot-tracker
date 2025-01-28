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
import { cloneElement, useRef } from 'react';
import React from 'react';
import { useAction, useAtom } from '@reatom/npm-react';
import { currentTeamAtom } from '../../../../../features/account/model';
import { fetchInviteMemberAtom, membersAtom } from './model';

interface CreateTeamDialogProps {
  opener: React.ReactElement;
}

export const InviteMemberDialog: React.FC<CreateTeamDialogProps> = ({ opener }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [currentTeam] = useAtom(currentTeamAtom);
  const [members] = useAtom(membersAtom);
  const [isVisible, setVisibility] = useAtom(false);
  const [email, setEmail] = useAtom('');
  const [error, setError] = useAtom<string | null>(null);
  const fetchInviteMember = useAction(fetchInviteMemberAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (members.find((m) => m.userEmail === email)) {
      setError('User already invited');
      return;
    }

    fetchInviteMember({
      teamId: currentTeam?.id as string,
      userEmail: email,
      teamName: currentTeam?.name as string,
    });

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
