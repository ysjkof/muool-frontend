import { ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { getApolloClient } from './apollo';
import { GlobalLayout } from './components';
import { setAuthToken, useStore } from './store';
import { localStorageUtils } from './utils/localStorageUtils';

function App() {
  useStore((state) => state.isLoggedIn); // 새로고침 시 리렌더 위한 사용
  setAuthToken();
  const client = getApolloClient(localStorageUtils.get({ key: 'token' }));

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <GlobalLayout />
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
