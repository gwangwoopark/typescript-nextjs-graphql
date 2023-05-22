import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { ApolloProvider } from "@apollo/client";
import client from "@libs/client/apolloClient";
import { AuthProvider } from "@context/authContext";

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const URI = publicRuntimeConfig.API_URI!;

console.log("URI", URI);

const httpLink = createHttpLink({
  uri: URI,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
});

const authLink = setContext(async (_, { headers }) => {
  const token = window.localStorage.getItem("token");

  const modifiedHeader = {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };

  return modifiedHeader;
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  uri: URI,
  cache: new InMemoryCache(),
});

export default client;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default MyApp;
