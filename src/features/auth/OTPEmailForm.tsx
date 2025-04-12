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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) return;

    db.auth
      .sendMagicCode({ email })
      .then(() => {
        onCodeSendComplete(email);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field invalid={!!error} errorText={error ? 'Error sending code' : undefined}>
            <Input
              disabled={isLoading}
              placeholder="Enter your email"
              type="email"
              value={email as string}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={254}
            />
          </Field>
        </Fieldset.Content>

        <Button className="p-mt-2" type="submit" colorScheme="brand" disabled={isLoading} loading={isLoading}>
          Send code
        </Button>
      </Fieldset.Root>
    </form>
  );
}
