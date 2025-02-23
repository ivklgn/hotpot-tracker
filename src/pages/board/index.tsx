import { Redirect, useParams } from 'wouter';
import { db } from '../../instantdb';
import { Board } from '../../features/board/Board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function BoardPage() {
  const params = useParams();
  const { data: board } = db.useQuery({
    boards: {
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
      <Board board={board.boards?.[0]} mode="edit" />
    </DndProvider>
  );
}
