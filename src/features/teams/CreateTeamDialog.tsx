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
import { createTeamWithMember } from '../../mutators';
import { useAtom } from '@reatom/npm-react';
import { userAtom } from '../auth/model';

interface CreateTeamDialogProps {
  opener: React.ReactElement;
}

export const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({ opener }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [user] = useAtom(userAtom);
  const [isVisible, setVisibility] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    const response = await createTeamWithMember({
      teamName,
      userEmail: user?.email as string,
      userId: user?.id as string,
    });

    setTeamName('');
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
