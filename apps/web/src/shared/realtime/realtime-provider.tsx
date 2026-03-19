"use client";

import { useApolloClient } from "@apollo/client/react";
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { usePathname } from "next/navigation";
import { getRealtimeEventsEndpoint } from "@/shared/apollo/client";

type RealtimeMutationEvent = {
  mutation: string;
  occurredAt: string;
};

type RealtimeContextValue = {
  lastEvent: RealtimeMutationEvent | null;
  version: number;
};

const RealtimeContext = createContext<RealtimeContextValue>({
  lastEvent: null,
  version: 0,
});

export function RealtimeProvider({ children }: PropsWithChildren) {
  const client = useApolloClient();
  const pathname = usePathname();
  const [state, setState] = useState<RealtimeContextValue>({
    lastEvent: null,
    version: 0,
  });
  const refetchTimeoutRef = useRef<number | null>(null);
  const isEnabled = !pathname.startsWith("/auth");

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const endpoint = getRealtimeEventsEndpoint();
    const source = new EventSource(endpoint);

    const handleMutation = (event: MessageEvent<string>) => {
      let payload: RealtimeMutationEvent;

      try {
        payload = JSON.parse(event.data) as RealtimeMutationEvent;
      } catch {
        return;
      }

      startTransition(() => {
        setState((current) => ({
          lastEvent: payload,
          version: current.version + 1,
        }));
      });

      if (refetchTimeoutRef.current !== null) {
        return;
      }

      refetchTimeoutRef.current = window.setTimeout(() => {
        refetchTimeoutRef.current = null;
        void client.reFetchObservableQueries().catch(() => {});
      }, 150);
    };

    source.addEventListener("mutation", handleMutation as EventListener);

    return () => {
      if (refetchTimeoutRef.current !== null) {
        window.clearTimeout(refetchTimeoutRef.current);
        refetchTimeoutRef.current = null;
      }
      source.removeEventListener("mutation", handleMutation as EventListener);
      source.close();
    };
  }, [client, isEnabled]);

  const value = useMemo(() => state, [state]);

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtimeVersion() {
  return useContext(RealtimeContext).version;
}
