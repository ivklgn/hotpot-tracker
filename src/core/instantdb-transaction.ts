import { IConwayError } from 'conway-errors';
import { errorContext } from './errors';
import { toaster } from '@/utils/toaster';

export const instantTransactionError = errorContext.feature('InstantTransactionError');

/**
 * Runs a mutation and handles any error that occurs
 * @param transaction The mutation to run
 * @returns The result of the mutation if it succeeds, or undefined if it fails
 */
export function runTransaction<T>(
  transaction: () => Promise<T>,
  onSuccess?: (result: T) => void,
  onError?: (error: IConwayError) => void
) {
  transaction()
    .then((result) => onSuccess?.(result))
    .catch((e) => {
      const error = instantTransactionError('BackendInteractionError', e.message, { originalError: e });

      error.emit();

      if (!onError) {
        toaster.create({
          title: 'Operation error, please try again',
          type: 'error',
        });
        return;
      }

      onError(error);
    });
}
