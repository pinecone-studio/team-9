"use client";

import { ApolloProvider } from "@apollo/client/react";
import { useState, type PropsWithChildren } from "react";
import {
  createApolloClient,
  type GetAuthToken,
} from "@/lib/apollo/client";

type AppApolloProviderProps = PropsWithChildren<{
  getToken?: GetAuthToken;
}>;

export function AppApolloProvider({
  children,
  getToken,
}: AppApolloProviderProps) {
  const [client] = useState(() => createApolloClient({ getToken }));

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
