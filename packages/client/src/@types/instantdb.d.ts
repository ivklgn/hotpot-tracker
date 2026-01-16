import type { TransactItem, InstaQLEntity, InstaQLResult } from '@instantdb/react';
import type { AppSchema } from '@hotpot/shared';

/**
 * Type alias for InstantDB transaction items
 * Use this for building transaction arrays to improve type safety and maintainability
 *
 * @example
 * ```typescript
 * const transactions: DBTransaction[] = [
 *   db.tx.tasks[taskId].update({ title: 'New title' }),
 *   db.tx.tasks[taskId].link({ columns: columnId })
 * ];
 * ```
 */
export type DBTransaction = TransactItem<AppSchema>;

/**
 * Common query type for boards with full column details
 * Includes tasks, smart params, statuses, and contributors
 */
export type BoardWithColumnsQuery = {
  boards: {
    columns: {
      tasks: {
        smartParams: {};
        approves: {};
        $: {
          where: {
            deletedAt: {
              $isNull: true;
            };
          };
        };
      };
      statuses: {
        $: {
          where: {
            deletedAt: {
              $isNull: true;
            };
          };
        };
      };
      contributors: {
        memberships: {};
      };
      $: {
        order: {
          position: 'asc';
        };
      };
    };
    smartParams: {};
  };
};

/**
 * Result type for BoardWithColumnsQuery
 */
export type BoardWithColumnsResult = InstaQLResult<AppSchema, BoardWithColumnsQuery>;

/**
 * Entity type for a board with columns
 */
export type BoardWithColumnsEntity = InstaQLEntity<AppSchema, 'boards', BoardWithColumnsQuery['boards']>;

/**
 * Common query type for tasks with full details
 * Includes columns, smart params, approves, and issues
 */
export type TaskDetailQuery = {
  tasks: {
    columns: {
      boards: {
        smartParams: {};
      };
      contributors: {
        memberships: {};
      };
      statuses: {};
    };
    smartParams: {};
    approves: {
      contributors: {
        memberships: {};
      };
    };
    issues: {
      replies: {
        memberships: {};
      };
      memberships: {};
    };
  };
};

/**
 * Result type for TaskDetailQuery
 */
export type TaskDetailResult = InstaQLResult<AppSchema, TaskDetailQuery>;

/**
 * Entity type for a task with full details
 */
export type TaskDetailEntity = InstaQLEntity<AppSchema, 'tasks', TaskDetailQuery['tasks']>;

/**
 * Common query type for team boards list
 */
export type TeamBoardsQuery = {
  boards: {
    columns: {};
    smartParams: {};
    $: {
      where: {
        teamId: string;
        deletedAt: {
          $isNull: true;
        };
      };
      order: {
        createdAt: 'desc';
      };
    };
  };
};

/**
 * Result type for TeamBoardsQuery
 */
export type TeamBoardsResult = InstaQLResult<AppSchema, TeamBoardsQuery>;

/**
 * Common query type for team memberships
 */
export type TeamMembershipsQuery = {
  memberships: {
    teams: {};
    $: {
      where: {
        teamId: string;
      };
    };
  };
};

/**
 * Result type for TeamMembershipsQuery
 */
export type TeamMembershipsResult = InstaQLResult<AppSchema, TeamMembershipsQuery>;

/**
 * Type-safe event payload discriminated union
 * Use this instead of Record<string, string> for event payloads
 */
export type EventPayload =
  | {
      type: 'review-task';
      taskId: string;
      taskTitle: string;
    }
  | {
      type: 'task-created';
      taskId: string;
      boardId: string;
      taskTitle: string;
    }
  | {
      type: 'task-deleted';
      taskId: string;
      taskTitle: string;
    }
  | {
      type: 'board-created';
      boardId: string;
      boardName: string;
    }
  | {
      type: 'board-deleted';
      boardId: string;
      boardName: string;
    };

/**
 * Parameters for creating an event with type-safe payload
 */
export type CreateEventParams<T extends EventPayload['type']> = {
  type: T;
  payload: Extract<EventPayload, { type: T }> extends { type: T }
    ? Omit<Extract<EventPayload, { type: T }>, 'type'>
    : never;
  teamId: string;
  membershipId: string;
};
