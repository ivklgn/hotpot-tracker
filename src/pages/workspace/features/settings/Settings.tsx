import { Button, Editable, IconButton, Table } from '@chakra-ui/react';
import { LuCheck, LuPencilLine, LuX } from 'react-icons/lu';
import { useAction, useAtom, useCtx } from '@reatom/npm-react';
import { currentTeamAtom } from '../../../../features/account/model';
import { fetchDeleteTeamAtom, fetchRenameTeamAtom } from './model';
import { ConfirmAction } from '../../../../components/ConfirmAction';

export function Settings() {
  const ctx = useCtx();
  const [currentTeam] = useAtom(currentTeamAtom);
  const fetchRenameTeam = useAction(fetchRenameTeamAtom);
  const fetchDeleteTeam = useAction(fetchDeleteTeamAtom);
  const [name, setName] = useAtom<string>(ctx.get(currentTeamAtom)?.name || '');

  const handleRenameTeam = ({ value: newName }: { value: string }) => {
    if (!newName) return;
    fetchRenameTeam(currentTeam?.id as string, newName);
  };

  const handleDeleteTeamClick = () => {
    fetchDeleteTeam(currentTeam?.id as string);
  };

  return (
    <Table.Root size="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Action</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row key="1">
          <Table.Cell>
            <Editable.Root
              maxW={480}
              value={name}
              onValueChange={(e) => setName(e.value)}
              placeholder="Click to edit"
              onValueCommit={handleRenameTeam}
            >
              <Editable.Preview />
              <Editable.Input />
              <Editable.Control>
                <Editable.EditTrigger asChild>
                  <IconButton variant="ghost" size="xs">
                    <LuPencilLine />
                  </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuX />
                  </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuCheck />
                  </IconButton>
                </Editable.SubmitTrigger>
              </Editable.Control>
            </Editable.Root>
          </Table.Cell>
          <Table.Cell textAlign="end"></Table.Cell>
        </Table.Row>
        <Table.Row key="2">
          <Table.Cell color="red.600">Delete team</Table.Cell>
          <Table.Cell textAlign="end">
            <ConfirmAction
              opener={
                <Button variant="outline" size="xs" colorPalette="red">
                  Delete
                </Button>
              }
              text="Are you sure you want to delete this team?"
              onOk={handleDeleteTeamClick}
            />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
