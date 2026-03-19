"use client";

import { ApolloProvider } from "@apollo/client/react";
import { useState, type PropsWithChildren } from "react";
import { createApolloClient } from "@/shared/apollo/client";
import { RealtimeProvider } from "@/shared/realtime/realtime-provider";

export function AppApolloProvider({ children }: PropsWithChildren) {
  const [client] = useState(createApolloClient);

  return (
    <ApolloProvider client={client}>
      <RealtimeProvider>{children}</RealtimeProvider>
    </ApolloProvider>
  );
}
