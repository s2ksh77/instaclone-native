import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition, offsetLimitPagination } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar('');

const TOKEN = 'token';

export const logUserIn = async (token) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};

// const httpLink = createHttpLink({
//   uri: 'http://192.168.151.53:4000/graphql',
// });

const uploadHttpLink = createUploadLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://soostaclone-backend.herokuapp.com/graphql'
      : 'http://192.168.151.53:4000/graphql',
});

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'ws://soostaclone-backend.herokuapp.com/graphql'
      : 'ws://192.168.151.53:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: tokenVar(),
    }),
  },
});

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
  client.resetStore();
};

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`Graph QL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log(`Network Error`, networkError);
  }
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLinks
);

const client = new ApolloClient({
  link: splitLink,
  cache,
});
//httpLink ?????? ????????? ????????????
export default client;

// ngrok http 4000 or localtunnel --port 4000 ????????? ??? ????????? uri ??????

// fetchMore ??? ??????
// seeFeed.offset:0  ?????? seeFeed.offset:2 ????????? ?????? argument ?????? ?????????
// ?????? ???????????? ????????? ??????.
// ????????? typePolicies ??? ?????? ?????? seeFeed??? query?????? argument??? ?????? ?????????????????? false ?????????.
// seeFeed: {
//   keyArgs: false,
//   merge(existing = [], incoming = []) {
//     return [...existing, ...incoming];
//   },
// },
// offsetLimitPagination(), *** ????????? ?????? ***
