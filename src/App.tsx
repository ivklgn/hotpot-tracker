import { Switch, Route, Redirect, useRoute } from 'wouter';
import { AuthPage } from './pages/auth';
import { WorkspacePage } from './pages/workspace';
import { AccountNavbar } from './features/account/Navbar';
import { AccountLayout } from './features/account/AccountLayout';
import { BoardsPage } from './pages/boards';
import { db } from './instantdb';
import { BoardPage } from './pages/board';
import { TaskPage } from './pages/task';
import { NotFoundPage } from './pages/404';
import { Landing } from './pages/landing';
import { Landing as LandingRu } from './pages/landing-ru';
import { SearchPage } from './pages/search';
import { SettingsPage } from './pages/settings';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

export default function App() {
  const { user, isLoading } = db.useAuth();
  const [isMainPage] = useRoute('/');
  const [isMainRuPage] = useRoute('/ru');

  if (isLoading) return null;

  if (user) {
    return (
      <GlobalErrorBoundary>
        <AccountLayout>
          {!isMainPage && !isMainRuPage && <AccountNavbar />}
          <Switch>
            <Route path="/workspace" component={() => <WorkspacePage />} />
            <Route path="/boards" component={() => <BoardsPage />} />
            <Route path="/board/:boardId" component={() => <BoardPage />} />
            <Route path="/task/:taskId" component={() => <TaskPage />} />
            <Route path="/search" component={() => <SearchPage />} />
            <Route path="/settings" component={() => <SettingsPage />} />
            <Route path="/" component={() => <Landing />} />
            <Route path="/ru" component={() => <LandingRu />} />
            <Route path="/404" component={() => <NotFoundPage />} />
            <Route path="/auth" component={() => <Redirect to="/workspace" />} />
            <Route path="*" component={() => <NotFoundPage />} />
          </Switch>
        </AccountLayout>
      </GlobalErrorBoundary>
    );
  }

  return (
    <GlobalErrorBoundary>
      <Switch>
        <Route path="/" component={() => <Landing />} />
        <Route path="/ru" component={() => <LandingRu />} />
        <Route path="/404" component={() => <NotFoundPage />} />
        <Route path="/auth" component={() => <AuthPage />} />
        <Route path="/workspace" component={() => <Redirect to="/auth" />} />
        <Route path="*" component={() => <NotFoundPage />} />
      </Switch>
    </GlobalErrorBoundary>
  );
}
