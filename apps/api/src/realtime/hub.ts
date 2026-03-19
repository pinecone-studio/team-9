const encoder = new TextEncoder();
const HEARTBEAT_INTERVAL_MS = 15000;

export type RealtimeMutationEvent = {
  mutation: string;
  occurredAt: string;
};

function encodeSseEvent(eventName: string, payload: unknown) {
  return encoder.encode(`event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`);
}

export class RealtimeHub {
  private readonly sessions = new Set<ReadableStreamDefaultController<Uint8Array>>();

  constructor(private readonly state: DurableObjectState) {
    void this.state.blockConcurrencyWhile(async () => {});
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname.endsWith("/stream")) {
      return this.handleStream();
    }

    if (request.method === "POST" && url.pathname.endsWith("/publish")) {
      return this.handlePublish(request);
    }

    return new Response("Not found.", { status: 404 });
  }

  private handleStream() {
    let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;
    let heartbeatId: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      if (heartbeatId !== null) {
        clearInterval(heartbeatId);
        heartbeatId = null;
      }

      if (controllerRef) {
        this.sessions.delete(controllerRef);
      }
    };

    const stream = new ReadableStream<Uint8Array>({
      start: (controller) => {
        controllerRef = controller;
        this.sessions.add(controller);
        controller.enqueue(
          encodeSseEvent("connected", {
            connectedAt: new Date().toISOString(),
          }),
        );
        heartbeatId = setInterval(() => {
          if (!controllerRef) {
            return;
          }

          try {
            controllerRef.enqueue(encoder.encode(": heartbeat\n\n"));
          } catch {
            cleanup();
          }
        }, HEARTBEAT_INTERVAL_MS);
      },
      cancel: cleanup,
    });

    return new Response(stream, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
      },
    });
  }

  private async handlePublish(request: Request) {
    const payload = (await request.json()) as RealtimeMutationEvent;
    const message = encodeSseEvent("mutation", payload);
    const staleControllers: ReadableStreamDefaultController<Uint8Array>[] = [];

    for (const controller of this.sessions) {
      try {
        controller.enqueue(message);
      } catch {
        staleControllers.push(controller);
      }
    }

    for (const controller of staleControllers) {
      this.sessions.delete(controller);
    }

    return Response.json({
      delivered: this.sessions.size,
      ok: true,
    });
  }
}
