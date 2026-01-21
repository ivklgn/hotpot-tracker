import { openai } from '@ai-sdk/openai';
import cors from '@fastify/cors';
import { createUIMessageStream, streamText } from 'ai';
import 'dotenv/config';
import Fastify from 'fastify';
import { db } from './instantdb.js';

// Type for auth user from InstantDB
interface AuthUser {
  id: string;
  email?: string | null;
}

const presetAsPromt: Record<string, string> = {
  basic: `
Generate a comprehensive board overview with the following sections:

1. BOARD SUMMARY
   - Board name and total number of columns
   - Total number of tasks across all columns
   - List of board parameters with their values

2. COLUMN ANALYSIS
   - For each column: name, number of tasks, and approval rule
   - Distribution of tasks across columns (percentage of total)
   - Identify columns with highest and lowest task counts

3. TASK STATUS OVERVIEW
   - Group tasks by their current status
   - Highlight tasks without approvals that may need attention
   - Include creation/update dates for time-sensitive information

4. TEAM OVERVIEW
   - List all team members involved in the board
   - For each team member: role and responsibilities based on task assignments
   - Identify team members with most and least assigned tasks

Present information in a clear, structured format with numerical data where applicable. Prioritize actionable insights that help track progress and identify bottlenecks.
`,
  team: `
Generate a detailed team performance report with the following sections:

1. TEAM OVERVIEW
   - Total number of team members
   - Total number of tasks and their distribution
   - Overall approval rate (percentage of tasks with approvals)

2. INDIVIDUAL PERFORMANCE
   - For each team member:
     * Number of tasks assigned to them
     * Number and percentage of tasks they have approved
     * Areas of focus based on task parameters

3. TASK ACTIVITY TIMELINE
   - Recent task updates grouped by team member
   - Analysis of task update patterns (which team members update tasks most frequently)
   - Tasks with most recent updates vs. tasks that haven't been updated recently
   - Identify periods of high activity vs. low activity based on update timestamps

4. WORKLOAD DISTRIBUTION
   - Visual representation of task distribution across team
   - Identify members with highest and lowest workloads
   - Balance analysis (whether work is evenly distributed)

5. UNASSIGNED TASKS
   - Number and percentage of unassigned tasks
   - List of unassigned tasks grouped by column/status
   - Recommendations for task assignment based on current workloads

6. APPROVAL PATTERNS
   - Cross-approval analysis (who approves whose tasks)
   - Columns/statuses with lowest approval rates
   - Tasks waiting longest for approval

Present data in a structured format with clear sections. Focus on actionable insights that help optimize team performance and workload balance.
`,
};

const app = Fastify({ logger: true });

app.register(cors, {
  origin: ['https://localhost:5173', 'https://hotpot-tracker.app', 'https://www.hotpot-tracker.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.get('/health', async (_request, _reply) => {
  return { status: 'ok' };
});

app.delete('/api/account', async function (request, reply) {
  if (!request.headers.refresh_token || typeof request.headers.refresh_token !== 'string') {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid request parameters',
      details: 'Please provide a valid refresh_token in the request headers',
    });
  }

  const refreshToken = request.headers.refresh_token as string;
  const scopedDb = db.asUser({ token: refreshToken });

  try {
    await scopedDb.auth.getUser({ refresh_token: refreshToken });
  } catch (e) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid request parameters',
      details: 'Please provide a valid refresh_token in the request headers',
    });
  }

  try {
    await scopedDb.auth.deleteUser({ refresh_token: refreshToken });
    return reply.status(200).send({
      statusCode: 200,
      message: 'User deleted successfully',
    });
  } catch (e) {
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal error',
      message: 'Unknown error',
    });
  }
});

app.post('/api/ai-report', async function (request, reply) {
  const boardId = (request.body as Record<string, string | undefined>)?.boardId;
  const preset = (request.body as Record<string, string | undefined>)?.preset;

  if (!boardId || typeof boardId !== 'string' || !preset || typeof preset !== 'string') {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid request parameters',
      details: 'Please provide a valid boardId/preset in the request body',
    });
  }

  if (!request.headers.refresh_token || typeof request.headers.refresh_token !== 'string') {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid request parameters',
      details: 'Please provide a valid boardId/preset in the request body',
    });
  }

  if (!request.headers.refresh_token || typeof request.headers.refresh_token !== 'string') {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid request parameters',
      details: 'Please provide a valid refresh_token in the request headers',
    });
  }

  const refreshToken = request.headers.refresh_token as string;
  const scopedDb = db.asUser({ token: refreshToken });
  let _user: AuthUser | undefined;

  try {
    const result = await scopedDb.auth.getUser({ refresh_token: refreshToken });
    _user = result as AuthUser;
  } catch (e) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid request parameters',
      details: 'Please provide a valid refresh_token in the request headers',
    });
  }

  let boards: any;

  try {
    boards = await scopedDb.query({
      boards: {
        columns: {
          tasks: {
            smartParams: {},
            approves: {},
            $: {
              where: {
                deletedAt: undefined,
              },
            },
          },
          statuses: {
            $: {
              where: {
                deletedAt: undefined,
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
            id: boardId as string,
          },
        },
      },
    });
  } catch (e) {
    console.error(e);
  }

  if (!boards?.boards || boards?.boards?.length === 0) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Board not found',
    });
  }

  const board = boards.boards[0];
  const mappedData = mapBoardData(board);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({
        type: 'data-initialized',
        data: { initialized: true },
      });

      const result = streamText({
        model: openai('gpt-4o'),
        system:
          'You are tracker manager assistant. After each request do not ask whats next or do not write any suggestions. Use for response language detected from tasks title. Use plain text for response, do not use markdown. Do not use any ids in report.',
        prompt: presetAsPromt[preset] + '\n' + transformBoardToPrompt(mappedData),
      });

      writer.merge(result.toUIMessageStream());
    },
    onError: (error: unknown) => {
      return error instanceof Error ? error.message : String(error);
    },
  });

  reply.header('X-Vercel-AI-Data-Stream', 'v1');
  reply.header('Content-Type', 'text/plain; charset=utf-8');

  return reply.send(stream);
});

export default app;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBoardData(board: any) {
  if (!board) {
    return {
      boardName: 'Unknown',
      boardSmartParams: [],
      columnsWithTasks: [],
    };
  }

  return {
    boardName: board.name || 'Unnamed Board',
    boardSmartParams:
      board.smartParams?.map((sp: any) => ({
        name: sp?.name || '',
        type: sp?.type || '',
        value: sp?.value || '',
      })) || [],
    columnsWithTasks:
      board.columns
        ?.map((col: any) => {
          if (!col) return null;
          return {
            columnName: col?.statuses?.name || 'Unnamed Column',
            approveRule: col.approveRule || null,
            tasks:
              col.tasks
                ?.map((task: any) => {
                  if (!task) return null;
                  return {
                    title: task.title || 'Unnamed Task',
                    createdAt: task.createdAt || null,
                    updatedAt: task.updatedAt || null,
                    smartParams:
                      task.smartParams
                        ?.map((sp: any) => {
                          if (!sp) return null;
                          return {
                            name: sp.name || '',
                            type: sp.type || '',
                            value: sp.value || '',
                          };
                        })
                        .filter(Boolean) || [],
                    approves:
                      task.approves
                        ?.map((approve: any) => {
                          if (!approve) return null;
                          return {
                            contributorId: approve.contributorId || 'Unknown',
                          };
                        })
                        .filter(Boolean) || [],
                  };
                })
                .filter(Boolean) || [],
          };
        })
        .filter(Boolean) || [],
  };
}

function transformBoardToPrompt(data: ReturnType<typeof mapBoardData>) {
  const lines: string[] = [];

  lines.push(`Board name: ${data.boardName || 'Unknown'}\n`);

  lines.push(`Board parameters:\n`);
  if (data.boardSmartParams && Array.isArray(data.boardSmartParams)) {
    for (const param of data.boardSmartParams) {
      if (!param) continue;

      if (param.type === 'user' && param.value) {
        try {
          const user = JSON.parse(param.value);
          lines.push(`-${capitalize(param.name || '')}: ${user?.userEmail || 'Unknown'}`);
        } catch (e) {
          // lines.push(`-${capitalize(param.name || "")}: Invalid user data`);
        }
      } else {
        lines.push(`-${capitalize(param.name || '')}: ${param.value || 'N/A'}`);
      }
    }
  }

  if (data.columnsWithTasks && Array.isArray(data.columnsWithTasks)) {
    for (const column of data.columnsWithTasks) {
      if (!column) continue;

      lines.push(`Column: ${column.columnName || 'Unnamed'}`);
      lines.push(`Approval Rule: ${column.approveRule || 'none'}\n`);

      if (column.tasks && Array.isArray(column.tasks)) {
        column.tasks.forEach((task: any, i: number) => {
          if (!task) return;

          lines.push(`${i + 1}. Task: ${task.title || 'Unnamed'}`);
          if (task.createdAt) {
            try {
              lines.push(`Created: ${new Date(task.createdAt).toISOString().split('T')[0]}`);
            } catch (e) {
              // lines.push(`Created: Invalid date`);
            }
          }

          if (task.updatedAt) {
            try {
              lines.push(`Updated: ${new Date(task.updatedAt).toISOString()}`);
            } catch (e) {
              // lines.push(`Created: Invalid date`);
            }
          }

          if (task.smartParams && Array.isArray(task.smartParams)) {
            lines.push(`Task parameters:\n`);

            for (const param of task.smartParams) {
              if (!param) continue;

              if (param.type === 'user' && param.value) {
                try {
                  const user = JSON.parse(param.value);
                  lines.push(`- ${capitalize(param.name || '')}: ${user?.userEmail || 'Unknown'}`);
                } catch (e) {
                  // lines.push(`- ${capitalize(param.name || "")}: Invalid user data`);
                }
              } else {
                lines.push(`- ${capitalize(param.name || '')}: ${param.value || 'N/A'}`);
              }
            }
          }

          if (task.approves && Array.isArray(task.approves) && task.approves.length > 0) {
            task.approves.forEach((a: any) => {
              if (!a) return;
              lines.push(`- Approved by contributor: ${a.contributorId || 'Unknown'}`);
            });
          } else {
            lines.push(`- Approvals: none`);
          }
        });
      }

      lines.push('\n');
    }
  }

  return lines.join('\n');
}

function capitalize(str: string | null | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
