import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getLocalStorageItem } from "../utils/local-storage";

// Create an http link to your GraphQL endpoint
const httpLink = createHttpLink({
    uri: import.meta.env.VITE_PUBLIC_WORDPRESS_API_URL,
});

// Set up the context link to include the authorization token
const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = getLocalStorageItem("token");

    // Return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// Create the Apollo Client instance
export const APOLLO_CLIENT = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
