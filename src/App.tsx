import { Switch, Route, Redirect } from 'wouter';
import { useAtom } from '@reatom/npm-react';
import { userAtom, userAuthLoadingAtom } from './features/auth/model';

import { AuthPage } from './pages/auth';
import { WorkspacePage } from './pages/workspace';
import { BoardsPage } from './pages/Boards';

export default function App() {
  const [user] = useAtom(userAtom);
  const [userAuthLoading] = useAtom(userAuthLoadingAtom);

  console.log({
    user,
    userAuthLoading,
  });

  if (userAuthLoading) return null;

  if (user) {
    return (
      <Switch>
        <Route path="/workspace" component={() => <WorkspacePage />} />
        <Route path="/boards" component={() => <BoardsPage />} />
        <Route path="/" component={() => <>hello</>} />
        <Route path="/404" component={() => <>404</>} />
        <Route path="/auth" component={() => <Redirect to="/workspace" />} />
        <Route>
          <>404</>
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={() => <>hello</>} />
      <Route path="/404" component={() => <>404</>} />
      <Route path="/auth" component={() => <AuthPage />} />
      <Route path="/workspace" component={() => <Redirect to="/auth" />} />
      <Route>
        <>404</>
      </Route>
    </Switch>
  );
}
