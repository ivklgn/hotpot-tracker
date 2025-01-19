import { Switch, Route } from "wouter";
import { PrivateRouter } from "./components/PrivateRouter";
import { db } from "@/instantdb";
import { AuthPage } from "./pages/Auth";
import { DashboardPage } from "./pages/Dashboard";

export default function App() {
  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Uh oh! {error.message}</div>;
  }

  return (
    <Switch>
      <Route path="/" component={() => <>hello</>} />
      <Route path="/404" component={() => <>404</>} />
      <Route path="/auth" component={() => <AuthPage />} />
      <PrivateRouter isAuthorized={!!user}>
        <Route path="/dashboard" component={() => <DashboardPage />} />
      </PrivateRouter>
      <Route>
        <>404</>
      </Route>
    </Switch>
  );
}
