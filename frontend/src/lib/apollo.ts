import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import * as SecureStore from "expo-secure-store"

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql", // Update with your server URL
})

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync("token")

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
