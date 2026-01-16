import { Button } from '@/components/ui/button';
import { Stack } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Fieldset } from '@chakra-ui/react';
import { useState } from 'react';
import { db } from '../../instantdb';
import { PinInput } from '@/components/ui/pin-input';
import { authError } from './errors';

interface OTPCodeFormProps {
  email: string;
}

export function OTPCodeForm({ email }: OTPCodeFormProps) {
  const [otp, setOTP] = useState<string[] | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!otp) {
      setErrorMessage('Invalid code format');
      setIsLoading(false);
      return;
    }

    if (!email) return;

    db.auth.signInWithMagicCode({ email, code: otp.join('') }).catch((err) => {
      if (err.status !== 400) {
        authError('BackendInteractionError', 'SignIn error', { originalError: err }).emit();
      }
      setErrorMessage('Invalid code or unknown error');
      setIsLoading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.HelperText>Okay we sent you an email! What was the code?</Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field invalid={!!errorMessage} errorText={errorMessage}>
            <PinInput
              count={6}
              onValueComplete={(value) => {
                setOTP(value.value);
              }}
              disabled={isLoading}
            />
          </Field>
        </Fieldset.Content>

        <Button className="p-mt-2" type="submit" colorScheme="brand" disabled={isLoading} loading={isLoading}>
          Verify code
        </Button>
      </Fieldset.Root>
    </form>
  );
}
