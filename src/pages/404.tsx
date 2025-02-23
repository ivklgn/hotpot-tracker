import { EmptyState, VStack, ButtonGroup, Button } from '@chakra-ui/react';
import { HiColorSwatch } from 'react-icons/hi';
import { useLocation } from 'wouter';

export function NotFoundPage() {
  const [, navigate] = useLocation();

  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <HiColorSwatch />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>404</EmptyState.Title>
          <EmptyState.Description>Page not found</EmptyState.Description>
        </VStack>
        <ButtonGroup>
          <Button
            variant="outline"
            onClick={() => {
              window.history.back();
            }}
          >
            Go back
          </Button>
          <Button onClick={() => navigate('/')}>Go to main</Button>
        </ButtonGroup>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
