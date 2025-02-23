import { Redirect, Switch } from 'wouter';

interface PrivateRouteProps {
  isAuthorized: boolean;
  children: React.ReactNode;
}

export const PrivateRouter = ({ isAuthorized, children }: PrivateRouteProps) => {
  if (!isAuthorized) {
    return <Redirect to="/auth" />;
  }

  return <Switch>{children}</Switch>;
};
