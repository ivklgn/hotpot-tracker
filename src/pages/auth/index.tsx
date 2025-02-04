import { useState } from 'react';
import { OTPEmailForm } from './features/OTPEmailForm';
import { OTPCodeForm } from './features/OTPCodeForm';

export function AuthPage() {
  const [email, setEmail] = useState('');

  if (!email) {
    return (
      <OTPEmailForm
        onCodeSendComplete={(email) => {
          setEmail(email);
        }}
      />
    );
  }

  return <OTPCodeForm email={email} />;
}
