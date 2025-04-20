import { IConwayError } from 'conway-errors';
import { err, ok, Result } from '../utils/result';
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
  onSuccess?: (result: Result<T, IConwayError>) => void,
  onError?: (error: IConwayError) => void
) {
  transaction()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .then((result) => onSuccess?.(ok(result)))
    .catch((e) => {
      const error = instantTransactionError('BackendInteractionError', e.message, { originalError: e });

      if (!onError) {
        toaster.create({
          title: 'Operation error, please try again',
          type: 'error',
        });
        error.emit();
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onError(err(error));
    });
}
