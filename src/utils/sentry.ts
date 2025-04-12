export function getOriginalErrorStringifiedInfo(originalError: unknown) {
  try {
    if (originalError instanceof Error) {
      return JSON.stringify(originalError, Object.getOwnPropertyNames(originalError));
    } else {
      return JSON.stringify(originalError);
    }
  } catch {
    return `Error stringifying original error object`;
  }
}
