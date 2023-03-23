import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: new URL("/graphql", process.env.WP_BASE_URL).toString(),
  cache: new InMemoryCache(),
});
