import { Box, Flex, Text } from '@chakra-ui/react';
import { db } from '../instantdb';
import { useEffect, useState } from 'react';

/**
 * ConnectionStatus component displays a notification banner when the user
 * loses connection to InstantDB. This helps users understand when their
 * changes might not be syncing to the server.
 */
export function ConnectionStatus() {
  const status = db.useConnectionStatus();
  const [showDisconnected, setShowDisconnected] = useState(false);

  // Only show disconnected state after a brief delay to avoid flashing
  // the banner during quick reconnects
  useEffect(() => {
    if (status === 'closed' || status === 'connecting' || status === 'errored') {
      const timer = setTimeout(() => {
        setShowDisconnected(true);
      }, 1000); // 1 second delay before showing banner
      return () => clearTimeout(timer);
    } else {
      // Schedule state update to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setShowDisconnected(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!showDisconnected) {
    return null;
  }

  const isConnecting = status === 'connecting';
  const message = isConnecting
    ? 'Reconnecting to server...'
    : 'You are offline. Changes will sync when reconnected.';

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bg={isConnecting ? 'yellow.500' : 'orange.500'}
      color="white"
      zIndex="banner"
      py="2"
      px="4"
      boxShadow="md"
    >
      <Flex justify="center" align="center" gap="2">
        <Box
          width="2"
          height="2"
          bg="white"
          borderRadius="full"
          animation={isConnecting ? 'pulse 1.5s ease-in-out infinite' : undefined}
        />
        <Text fontSize="sm" fontWeight="medium">
          {message}
        </Text>
      </Flex>
    </Box>
  );
}
