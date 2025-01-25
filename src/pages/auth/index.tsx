import { Button } from '@/components/ui/button';
import { Heading, Box, Input, Stack } from '@chakra-ui/react';
import { PinInput } from '@/components/ui/pin-input';
import { Field } from '@/components/ui/field';
import { Fieldset } from '@chakra-ui/react';
import { useAction, useAtom } from '@reatom/npm-react';
import {
  emailAtom,
  emailSentAtom,
  fetchSendMagickCodeAtom,
  fetchSignInWithMagickCodeAtom,
  otpCodeAtom,
} from './model';

export function AuthPage() {
  const [email, setEmail] = useAtom(emailAtom);
  const [emailSent] = useAtom(emailSentAtom);
  const [otpCode, setOtpCode] = useAtom(otpCodeAtom);
  const fetchSendMagickCode = useAction(fetchSendMagickCodeAtom);
  const fetchSignInWithMagickCode = useAction(fetchSignInWithMagickCodeAtom);
  const [magickCodeError] = useAtom(fetchSendMagickCodeAtom.errorAtom);
  const [signInError] = useAtom(fetchSignInWithMagickCodeAtom.errorAtom);
  const [isLoadingSendCode] = useAtom((ctx) => ctx.spy(fetchSendMagickCodeAtom.pendingAtom) > 0);
  const [isLoadingSignIn] = useAtom((ctx) => ctx.spy(fetchSignInWithMagickCodeAtom.pendingAtom) > 0);

  if (isLoadingSignIn) {
    return null;
  }

  if (!emailSent) {
    return (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundSize: 'cover',
          minHeight: '100dvh',
          padding: '16px',
        }}
      >
        <Box
          bg="chakra-body-bg"
          borderWidth="1px"
          style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: '12px',
            padding: '32px',
          }}
        >
          <Heading mb="8" fontSize="2xl">
            Auth with OTP
          </Heading>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email) return;
              fetchSendMagickCode(email);
            }}
          >
            <Fieldset.Root size="lg" maxW="md">
              <Fieldset.Content>
                <Field
                  invalid={!!magickCodeError}
                  errorText={magickCodeError ? 'Error sending code' : undefined}
                >
                  <Input
                    autoFocus
                    placeholder="Enter your email"
                    type="email"
                    value={email as string}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
              </Fieldset.Content>

              <Button className="p-mt-2" type="submit" colorScheme="brand" disabled={isLoadingSendCode}>
                Send code
              </Button>
            </Fieldset.Root>
          </form>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        minHeight: '100dvh',
        padding: '16px',
      }}
    >
      <Box
        bg="chakra-body-bg"
        borderWidth="1px"
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '12px',
          padding: '32px',
        }}
      >
        <Heading mb="8" fontSize="2xl">
          Auth with OTP
        </Heading>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!otpCode) return;
            fetchSignInWithMagickCode({ email, code: otpCode });
          }}
        >
          <Fieldset.Root size="lg" maxW="md">
            <Stack>
              <Fieldset.HelperText>Okay we sent you an email! What was the code?</Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
              <Field
                invalid={!!signInError}
                errorText={signInError ? 'Invalid code or unknown error' : undefined}
              >
                <PinInput
                  count={6}
                  value={otpCode}
                  onValueChange={({ value }) => {
                    setOtpCode(value);
                  }}
                />
              </Field>
            </Fieldset.Content>

            <Button className="p-mt-2" type="submit" colorScheme="brand" disabled={isLoadingSignIn}>
              Verify code
            </Button>
          </Fieldset.Root>
        </form>
      </Box>
    </Box>
  );
}
