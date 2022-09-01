import { Route, Routes } from 'react-router-dom';
import { GlobalLayout } from '../components/templates/GlobalLayout';
import { AuthContainer } from '../pages/auth/components/AuthContainer';
import { Login } from '../pages/auth/Login';
import { SignUp } from '../pages/auth/SignUp';
import { LoginRouteProps } from './LoginRoute';
import { ENDPOINT, ROUTES } from './routes';

function LogoutRoute({ CommonRoute }: LoginRouteProps) {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout />}>
        <Route
          path={ROUTES.login}
          element={
            <AuthContainer>
              <Login />
            </AuthContainer>
          }
        />
        <Route
          path={ROUTES.sign_up}
          element={
            <AuthContainer>
              <SignUp />
            </AuthContainer>
          }
        />
        {CommonRoute}
      </Route>
    </Routes>
  );
}
export default LogoutRoute;
