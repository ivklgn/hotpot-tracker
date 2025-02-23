import { Switch, Route, Redirect } from 'wouter';
import { AuthPage } from './pages/auth';
import { WorkspacePage } from './pages/workspace';
import { AccountNavbar } from './features/account/Navbar';
import { AccountLayout } from './features/account/AccountLayout';
import { BoardsPage } from './pages/boards';
import { db } from './instantdb';
import { BoardPage } from './pages/board';
import { TaskPage } from './pages/task';
import { NotFoundPage } from './pages/404';
import Landing from './pages';

export default function App() {
  const { user, isLoading } = db.useAuth();

  if (isLoading) return null;

  if (user) {
    return (
      <AccountLayout>
        <AccountNavbar />
        <Switch>
          <Route path="/workspace" component={() => <WorkspacePage />} />
          <Route path="/boards" component={() => <BoardsPage />} />
          <Route path="/board/:boardId" component={() => <BoardPage />} />
          <Route path="/task/:taskId" component={() => <TaskPage />} />
          <Route path="/" component={() => <Redirect to="/workspace" />} />
          <Route path="/404" component={() => <NotFoundPage />} />
          <Route path="/auth" component={() => <Redirect to="/workspace" />} />
          <Route path="/landing" component={() => <Landing />} />
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </AccountLayout>
    );
  }

  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/auth" />} />
      <Route path="/404" component={() => <NotFoundPage />} />
      <Route path="/auth" component={() => <AuthPage />} />
      <Route path="/workspace" component={() => <Redirect to="/auth" />} />
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
