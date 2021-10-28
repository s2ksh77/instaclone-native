import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar('');

export const logUserIn = async (token) => {
  await AsyncStorage.multiSet([
    ['token', JSON.stringify(token)],
    ['loggedIn', JSON.stringify('yes')],
  ]);
  isLoggedInVar(true);
  tokenVar(token);
};

const client = new ApolloClient({
  uri: 'http://4fa5-210-90-149-11.ngrok.io/graphql',
  cache: new InMemoryCache(),
});

export default client;

// ngrok http 4000 or localtunnel --port 4000 이거로 젠 된거로 uri 바꿈
