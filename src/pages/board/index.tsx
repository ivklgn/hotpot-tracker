import { Redirect, useParams } from 'wouter';
import { db } from '../../instantdb';
import { Board } from '../../features/board/Board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Helm from '../../components/Helm';

export function BoardPage() {
  const params = useParams();
  const { data: board } = db.useQuery({
    boards: {
      columns: {
        tasks: {
          smartParams: {},
          approves: {},
          $: {
            where: {
              deletedAt: {
                $isNull: true,
              },
            },
          },
        },
        statuses: {
          $: {
            where: {
              deletedAt: {
                $isNull: true,
              },
            },
          },
        },
        contributors: {
          memberships: {},
        },
        $: {
          order: {
            position: 'asc',
          },
        },
      },
      smartParams: {},
      $: {
        where: {
          id: params?.boardId as string,
        },
      },
    },
  });

  if (!params?.boardId) return <Redirect to="/404" />;

  if (!board) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Helm title={board.boards?.[0]?.name || 'Board'} />
      <Board board={board.boards?.[0]} mode="edit" />
    </DndProvider>
  );
}
