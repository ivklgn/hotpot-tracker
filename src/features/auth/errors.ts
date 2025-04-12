import { errorContext } from '../../core/errors';

const authErrorContext = errorContext.subcontext('Auth');

export const authError = authErrorContext.feature('AuthError');
