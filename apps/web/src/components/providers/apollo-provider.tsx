"use client";

import { ApolloProvider } from "@apollo/client/react";
import { useState, type PropsWithChildren } from "react";
import { createApolloClient } from "@/lib/apollo/client";

export function AppApolloProvider({ children }: PropsWithChildren) {
  const [client] = useState(createApolloClient);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
