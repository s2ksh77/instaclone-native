import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

const TOKEN = "token";

export const logUserIn = async (token) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};

const httpLink = createHttpLink({
  uri: "http://192.168.35.227:4000/graphql",
});

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
};

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export default client;

// ngrok http 4000 or localtunnel --port 4000 이거로 젠 된거로 uri 바꿈

// fetchMore 를 했어
// seeFeed.offset:0  이랑 seeFeed.offset:2 이거랑 다른 argument 라고 생각함
// 캐시 메모리에 합치지 않아.
// 그래서 typePolicies 의 쿼리 중에 seeFeed의 query들을 argument에 따라 구별시키는걸 false 시킨다.
// seeFeed: {
//   keyArgs: false,
//   merge(existing = [], incoming = []) {
//     return [...existing, ...incoming];
//   },
// },
// offsetLimitPagination(), *** 동일한 동작 ***
