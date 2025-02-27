import { Button } from '@/components/ui/button';
import { Input } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Fieldset } from '@chakra-ui/react';
import { useState } from 'react';
import { db } from '../../instantdb';

interface OTPEmailFormProps {
  onCodeSendComplete: (email: string) => void;
}

export function OTPEmailForm({ onCodeSendComplete }: OTPEmailFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    db.auth
      .sendMagicCode({ email })
      .then(() => {
        onCodeSendComplete(email);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field invalid={!!error} errorText={error ? 'Error sending code' : undefined}>
            <Input
              autoFocus
              placeholder="Enter your email"
              type="email"
              value={email as string}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
        </Fieldset.Content>

        <Button className="p-mt-2" type="submit" colorScheme="brand" /*disabled={isLoadingSendCode}*/>
          Send code
        </Button>
      </Fieldset.Root>
    </form>
  );
}
