import * as Sentry from '@sentry/react';
import { createError } from 'conway-errors';

const createErrorContext = createError(
  [
    { errorType: 'BackendInteractionError' },
    { errorType: 'UnexpectedError' },
    { errorType: 'ExpectedError' },
  ] as const,
  {
    handleEmit: (err) => {
      Sentry.captureException(err);
    },
  }
);

export const errorContext = createErrorContext('HotpotTracker');
