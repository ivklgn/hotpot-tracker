import { Redirect, useParams } from 'wouter';
import { db } from '../../instantdb';
import { Task } from '../../features/task/Task';

export function TaskPage() {
  const params = useParams();
  const { data: task } = db.useQuery({
    tasks: {
      smartParams: {},
      columns: {},
      $: {
        where: {
          id: params?.taskId as string,
        },
      },
    },
  });

  if (!params?.taskId) return <Redirect to="/404" />;

  if (!task) return null;

  return <Task task={task.tasks?.[0]} />;
}
