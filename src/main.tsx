import { createCtx, connectLogger } from '@reatom/framework';
import { reatomContext } from '@reatom/npm-react';
import { Provider } from '@/components/ui/provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const ctx = createCtx();
if (import.meta.env.DEV) {
  connectLogger(ctx);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <reatomContext.Provider value={ctx}>
      <Provider>
        <App />
      </Provider>
    </reatomContext.Provider>
  </StrictMode>
);
