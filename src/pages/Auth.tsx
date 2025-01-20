import { db } from '@/instantdb';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heading, Box, Input, Stack } from '@chakra-ui/react';
import { PinInput } from '@/components/ui/pin-input';
import { Field } from '@/components/ui/field';
import { Fieldset } from '@chakra-ui/react';
import { Redirect } from 'wouter';

export function AuthPage() {
  const { user } = db.useAuth();

  const [state, setState] = useState({
    sentEmail: '',
    email: '',
    error: null,
    code: ['', '', '', '', '', ''],
  });

  const { sentEmail, email, code, error } = state;

  if (user) {
    return <Redirect to="/workspace" />;
  }

  if (!sentEmail) {
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

              try {
                await db.auth.sendMagicCode({ email });
                setState({ ...state, sentEmail: email, error: null });
              } catch (error: any) {
                setState({ ...state, error: error.body?.message });
              }
            }}
          >
            <Fieldset.Root size="lg" maxW="md">
              <Fieldset.Content>
                <Field invalid={!!error} errorText={error ? 'Error sending code' : undefined}>
                  <Input
                    autoFocus
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setState({ ...state, email: e.target.value, error: null })}
                  />
                </Field>
              </Fieldset.Content>

              <Button className="p-mt-2" type="submit" colorScheme="brand">
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
          onSubmit={async (e) => {
            e.preventDefault();

            if (!code) return;

            try {
              await db.auth.signInWithMagicCode({
                email: sentEmail,
                code: code.join(''),
              });
            } catch (error: any) {
              setState({ ...state, error: error.body?.message });
            }
          }}
        >
          <Fieldset.Root size="lg" maxW="md">
            <Stack>
              <Fieldset.HelperText>Okay we sent you an email! What was the code?</Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
              <Field invalid={!!error} errorText={error ? 'Invalid code or unknown error' : undefined}>
                <PinInput
                  count={6}
                  value={code}
                  onValueChange={({ value }) => {
                    setState({
                      ...state,
                      code: value,
                      error: null,
                    });
                  }}
                />
              </Field>
            </Fieldset.Content>

            <Button className="p-mt-2" type="submit" colorScheme="brand">
              Verify code
            </Button>
          </Fieldset.Root>
        </form>
      </Box>
    </Box>
  );
}
