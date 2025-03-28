import { openai } from '@ai-sdk/openai';
import { createDataStream, streamText } from 'ai';
import 'dotenv/config';
import Fastify from 'fastify';
import { db } from './instantdb';

const fastify = Fastify({ logger: true });

fastify.post('/ai-report', async function (request, reply) {
  console.log(request.headers.refresh_token);
  const scopedDb = db.asUser({ token: request.headers.refresh_token as string });
  try {
    const boards = await scopedDb.query({ boards: {} });
    console.log(boards);
  } catch (e) {
    console.error(e);
  }
  return reply.send('resposne');

  // immediately start streaming the response
  const dataStream = createDataStream({
    execute: async (dataStreamWriter) => {
      dataStreamWriter.writeData('initialized call');

      const result = streamText({
        model: openai('gpt-4o'),
        prompt: 'Invent a new holiday and describe its traditions.',
      });

      result.mergeIntoDataStream(dataStreamWriter);
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });

  // Mark the response as a v1 data stream:
  reply.header('X-Vercel-AI-Data-Stream', 'v1');
  reply.header('Content-Type', 'text/plain; charset=utf-8');

  return reply.send(dataStream);
});

fastify.listen({ port: 8080 });
