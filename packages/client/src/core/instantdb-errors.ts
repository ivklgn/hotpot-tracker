/**
 * InstantDB Error Types and Utilities
 *
 * This module provides type-safe error handling for InstantDB operations,
 * particularly for permission-related errors.
 */

export interface InstantDBError extends Error {
  originalError?: {
    hint?: {
      expected?: string;
    };
  };
}

/**
 * Type guard to check if an error is a permission error from InstantDB.
 * Permission errors typically have the hint.expected === 'perms-pass?'
 */
export function isInstantDBPermissionError(error: unknown): error is InstantDBError {
  return (
    error instanceof Error &&
    'originalError' in error &&
    typeof error.originalError === 'object' &&
    error.originalError !== null &&
    'hint' in error.originalError &&
    typeof error.originalError.hint === 'object' &&
    error.originalError.hint !== null &&
    'expected' in error.originalError.hint &&
    error.originalError.hint.expected === 'perms-pass?'
  );
}

/**
 * Type guard to check if an error is an InstantDB error (may not be permission-related)
 */
export function isInstantDBError(error: unknown): error is InstantDBError {
  return error instanceof Error && 'originalError' in error && typeof error.originalError === 'object';
}
