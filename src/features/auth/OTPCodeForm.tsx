import { Button } from '@/components/ui/button';
import { Stack } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Fieldset } from '@chakra-ui/react';
import { useState } from 'react';
import { db } from '../../instantdb';
import { PinInput } from '@/components/ui/pin-input';

interface OTPCodeFormProps {
  email: string;
}

export function OTPCodeForm({ email }: OTPCodeFormProps) {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    db.auth.signInWithMagicCode({ email, code: otp.join('') }).catch((err) => {
      setError(err);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.HelperText>Okay we sent you an email! What was the code?</Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field invalid={!!error} errorText={error ? 'Invalid code or unknown error' : undefined}>
            <PinInput
              count={6}
              value={otp}
              onValueChange={({ value }) => {
                setOTP(value);
              }}
            />
          </Field>
        </Fieldset.Content>

        <Button className="p-mt-2" type="submit" colorScheme="brand" /*disabled={isLoadingSignIn}*/>
          Verify code
        </Button>
      </Fieldset.Root>
    </form>
  );
}
