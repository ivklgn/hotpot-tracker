export type Result<T, E> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  readonly ok = true as const;
  constructor(public readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok<U, E>(fn(this.value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapErr<F>(_: (err: E) => F): Result<T, F> {
    return new Ok<T, F>(this.value);
  }
}

export class Err<T, E> {
  readonly ok = false as const;
  constructor(public readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<U>(_: (value: T) => U): Result<U, E> {
    return new Err<U, E>(this.error);
  }

  mapErr<F>(fn: (err: E) => F): Result<T, F> {
    return new Err<T, F>(fn(this.error));
  }
}

export function ok<T, E = never>(value: T): Result<T, E> {
  return new Ok<T, E>(value);
}

export function err<T = never, E = unknown>(error: E): Result<T, E> {
  return new Err<T, E>(error);
}
