import { useState } from 'react';
import { OTPEmailForm } from './OTPEmailForm';
import { OTPCodeForm } from './OTPCodeForm';

export function Auth() {
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
