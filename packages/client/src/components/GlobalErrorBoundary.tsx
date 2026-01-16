import { ErrorBoundary } from 'react-error-boundary';
import { EmptyState, VStack, ButtonGroup, Button } from '@chakra-ui/react';
import { HiColorSwatch } from 'react-icons/hi';
import { useLocation } from 'wouter';
import { errorContext } from '../core/errors';

const globalErrorBoundaryError = errorContext.feature('GlobalErrorBoundaryError');

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onError={(e) => {
        const message = e instanceof Error ? e.message : String(e);
        globalErrorBoundaryError('UnexpectedError', message, { originalError: e }).emit();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function Fallback() {
  const [, navigate] = useLocation();

  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <HiColorSwatch />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>Something went wrong</EmptyState.Title>
          <EmptyState.Description>Try to refresh the page</EmptyState.Description>
        </VStack>
        <ButtonGroup>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = '/';
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
