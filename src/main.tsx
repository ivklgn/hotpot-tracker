import * as Sentry from '@sentry/react';
import { Provider } from '@/components/ui/provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { getOriginalErrorStringifiedInfo } from './utils/sentry.ts';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: import.meta.env.PROD,
  beforeSend: (event, hint) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (hint.originalException?.originalError && event.contexts) {
      event.contexts['original error'] = {
        value: getOriginalErrorStringifiedInfo(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          hint.originalException?.originalError
        ),
      };
    }

    return event;
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
