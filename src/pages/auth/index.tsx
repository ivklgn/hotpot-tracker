import { Box, Heading } from '@chakra-ui/react';
import { Auth } from '../../features/auth';

export function AuthPage() {
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
        <Auth />
      </Box>
    </Box>
  );
}
