import { toaster } from '../components/ui/toaster';
import { errorContext } from './errors';

export const instantTransactionError = errorContext.feature('InstantTransactionError');

/**
 * Runs a mutation and handles any error that occurs
 * @param transaction The mutation to run
 * @returns The result of the mutation if it succeeds, or undefined if it fails
 */
export function runTransaction<T>(transaction: () => Promise<T>, onError?: (e: unknown) => void) {
  transaction().catch((e) => {
    const error = instantTransactionError('BackendInteractionError', e.message, { originalError: e });

    if (!onError) {
      toaster.create({
        title: 'Operation error, please try again',
        type: 'error',
      });
      error.emit();
      return;
    }

    onError(error);
  });
}
