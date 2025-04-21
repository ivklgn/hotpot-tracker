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
      if (import.meta.env.PROD) {
        Sentry.captureException(err);
      } else {
        console.error(err, err.originalError);
      }
    },
  }
);

export const errorContext = createErrorContext('HotpotTracker');
