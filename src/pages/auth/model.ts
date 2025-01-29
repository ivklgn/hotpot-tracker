import { reatomAsync, withErrorAtom } from '@reatom/async';
import { atom } from '@reatom/framework';
import { db } from '../../instantdb';

export const emailAtom = atom<string>('');
export const emailSentAtom = atom(false);
export const otpCodeAtom = atom(['', '', '', '', '', '']);

export const fetchSendMagickCodeAtom = reatomAsync(
  (_ctx, email: string) => db.auth.sendMagicCode({ email }),
  {
    name: 'fetchSendMagickCodeAtom',
    onFulfill(ctx) {
      emailSentAtom(ctx, true);
    },
  }
).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);

export const fetchSignInWithMagickCodeAtom = reatomAsync(
  (_ctx, { email, code }: { email: string; code: string[] }) =>
    db.auth.signInWithMagicCode({
      email,
      code: code.join(''),
    }),
  {
    name: 'fetchSignInWithMagickCodeAtom',
    onEffect(ctx) {
      otpCodeAtom(ctx, ['', '', '', '', '', '']);
      emailSentAtom(ctx, false);
    },
  }
).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);
