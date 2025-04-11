import { Box, Button, Table } from '@chakra-ui/react';
import Helm from '../../components/Helm';
import { ConfirmAction } from '../../components/ConfirmAction';
import { db } from '../../instantdb';

export function SettingsPage() {
  const { user } = db.useAuth();
  const handleDeleteAccount = () => {
    fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/account`, {
      method: 'DELETE',
      headers: {
        refresh_token: user?.refresh_token as string,
      },
    })
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box flex="1" pt={8} mx={6}>
      <Helm title="Settings" />
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Settings</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Delete my account</Table.Cell>
            <Table.Cell textAlign="end">
              <ConfirmAction
                opener={
                  <Button colorPalette="red" size="xs">
                    Delete
                  </Button>
                }
                text="Are you sure delete account? You'll remove all boards, columns and tasks."
                onOk={handleDeleteAccount}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
