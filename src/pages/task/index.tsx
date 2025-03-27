import { Redirect, useParams } from 'wouter';
import { db } from '../../instantdb';
import { Task } from '../../features/task/Task';
import Helm from '../../components/Helm';

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

  return (
    <>
      <Helm title={task.tasks?.[0]?.title ?? 'Task'} />
      <Task task={task.tasks?.[0]} />
    </>
  );
}
