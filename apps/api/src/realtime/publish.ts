import type { RealtimeMutationEvent } from "./hub";

type RealtimeBindings = {
  REALTIME_HUB: DurableObjectNamespace;
};

const REALTIME_HUB_NAME = "ebms-global";
const REALTIME_INTERNAL_URL = "https://realtime.internal";

export async function publishRealtimeMutation(
  env: RealtimeBindings,
  mutation: string,
) {
  const id = env.REALTIME_HUB.idFromName(REALTIME_HUB_NAME);
  const stub = env.REALTIME_HUB.get(id);
  const payload: RealtimeMutationEvent = {
    mutation,
    occurredAt: new Date().toISOString(),
  };

  await stub.fetch(`${REALTIME_INTERNAL_URL}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function getRealtimeHubStub(env: RealtimeBindings) {
  const id = env.REALTIME_HUB.idFromName(REALTIME_HUB_NAME);
  return env.REALTIME_HUB.get(id);
}
