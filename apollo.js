import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

export const isLoggedInVar = makeVar(false);

const client = new ApolloClient({
  uri: 'http://2e07-210-90-149-11.ngrok.io/graphql',
  cache: new InMemoryCache(),
});

export default client;

// ngrok http 4000 or localtunnel --port 4000 이거로 젠 된거로 uri 바꿈
