import { toaster } from '../../components/ui/toaster';

/**
 * Runs a mutation and handles any error that occurs
 * @param mutation The mutation to run
 * @returns The result of the mutation if it succeeds, or undefined if it fails
 */
export function runMutation<T>(mutation: () => Promise<T>) {
  return mutation().catch((e) => {
    // TODO: emit
    console.log(e);
    toaster.create({
      title: 'Operation error, please try again',
      type: 'error',
    });
  });
}
