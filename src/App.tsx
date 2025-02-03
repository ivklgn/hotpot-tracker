import { Switch, Route, Redirect } from 'wouter';
import { useAtom } from '@reatom/npm-react';
import { userAtom, userAuthLoadingAtom } from './features/auth/model';

import { AuthPage } from './pages/auth';
import { WorkspacePage } from './pages/workspace';
import { AccountNavbar } from './features/account/Navbar';
import { AccountLayout } from './features/account/Layout';
import { BoardsPage } from './pages/boards';
import { currentTeamIdAtom } from './features/account/model';

export default function App() {
  const [user] = useAtom(userAtom);
  const [userAuthLoading] = useAtom(userAuthLoadingAtom);
  const [currentTeamId] = useAtom(currentTeamIdAtom);

  if (userAuthLoading) return null;

  if (user) {
    return (
      <AccountLayout>
        <AccountNavbar />
        <Switch>
          <Route path="/workspace" component={() => <WorkspacePage />} />
          <Route path="/boards" component={() => <BoardsPage key={currentTeamId} />} />
          <Route path="/" component={() => <Redirect to="/workspace" />} />
          <Route path="/404" component={() => <>404</>} />
          <Route path="/auth" component={() => <Redirect to="/workspace" />} />
          <Route>
            <>404</>
          </Route>
        </Switch>
      </AccountLayout>
    );
  }

  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/auth" />} />
      <Route path="/404" component={() => <>404</>} />
      <Route path="/auth" component={() => <AuthPage />} />
      <Route path="/workspace" component={() => <Redirect to="/auth" />} />
      <Route>
        <>404</>
      </Route>
    </Switch>
  );
}
