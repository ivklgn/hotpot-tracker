import { createError } from 'conway-errors';

const createErrorContext = createError([
  { errorType: 'BackendInteractionError' },
  { errorType: 'UnexpectedError' },
] as const);

export const errorContext = createErrorContext('HotpotTracker');
