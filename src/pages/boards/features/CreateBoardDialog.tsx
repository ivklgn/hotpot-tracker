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
import { fetchCreateBoardAtom } from './model';

interface CreateTeamDialogProps {
  opener: React.ReactElement;
}

export const CreateBoardDialog: React.FC<CreateTeamDialogProps> = ({ opener }) => {
  const ref = useRef<HTMLInputElement>(null);
  // const [currentTeam] = useAtom(currentTeamAtom);
  // const [members] = useAtom(membersAtom);
  const [isVisible, setVisibility] = useAtom(false);
  const [name, setName] = useAtom('');
  const [error, setError] = useAtom<string | null>(null);
  const fetchCreateBoard = useAction(fetchCreateBoardAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    fetchCreateBoard({
      name,
    });

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
