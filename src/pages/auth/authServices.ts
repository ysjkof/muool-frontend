import { authTokenVar, isLoggedInVar } from '../../apollo';
import { LOCAL_STORAGE_KEY } from '../../constants/localStorage';
import { loggedInUserVar } from '../../store';

export const login = (token: string, callback?: () => void) => {
  localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, token);
  authTokenVar(token);
  isLoggedInVar(true);

  if (callback) callback();
};

export const logout = (callback?: () => void) => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN);
  authTokenVar(null);
  isLoggedInVar(false);
  loggedInUserVar(null);

  if (callback) callback();
};