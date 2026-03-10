import { Hono } from "hono";
import yoga from "./graphql";

type Bindings = {
  DB: D1Database;
  ASSETS: R2Bucket;
  R2_SIGNING_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();
const SIGNED_URL_TTL_SECONDS = 7 * 24 * 60 * 60;

const sanitizePathPart = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");

const buildContractKey = (benefitId: string, version: string, filename: string) =>
  `contracts/${sanitizePathPart(benefitId)}/${sanitizePathPart(version)}/${sanitizePathPart(filename)}`;

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const signMessage = async (secret: string, message: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toBase64Url(new Uint8Array(signature));
};

const buildSignedContractUrl = async (baseUrl: string, key: string, secret: string) => {
  const expires = Math.floor(Date.now() / 1000) + SIGNED_URL_TTL_SECONDS;
  const payload = `${key}:${expires}`;
  const sig = await signMessage(secret, payload);
  const encodedKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${baseUrl}/contracts/object/${encodedKey}?exp=${expires}&sig=${sig}`;
};

app.get("/", (c) => c.text("EBMS backend running"));

app.post("/contracts/upload", async (c) => {
  try {
    const form = await c.req.formData();
    const fileValue = form.get("file");
    const benefitIdRaw = form.get("benefitId");
    const versionRaw = form.get("version");

    if (!fileValue || typeof fileValue === "string") {
      return c.json(
        {
          success: false,
          message: "`file` talbar shaardlagatai (multipart/form-data)",
        },
        400,
      );
    }

    if (typeof benefitIdRaw !== "string" || typeof versionRaw !== "string") {
      return c.json(
        {
          success: false,
          message: "`benefitId` bolon `version` talbar shaardlagatai",
        },
        400,
      );
    }

    const upload = fileValue as unknown as Blob & { name?: string };
    const originalName =
      typeof upload.name === "string" && upload.name.length > 0 ? upload.name : "upload.bin";
    const key = buildContractKey(benefitIdRaw, versionRaw, originalName);

    await c.env.ASSETS.put(key, upload, {
      httpMetadata: {
        contentType: upload.type || "application/octet-stream",
      },
    });

    const signedUrl = await buildSignedContractUrl(new URL(c.req.url).origin, key, c.env.R2_SIGNING_SECRET);

    return c.json(
      {
        success: true,
        message: "Contract uploaded successfully",
        data: {
          key,
          size: upload.size,
          contentType: upload.type || "application/octet-stream",
          signedUrl,
          ttlSeconds: SIGNED_URL_TTL_SECONDS,
        },
      },
      201,
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Upload contract error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.get("/contracts/signed-url", async (c) => {
  try {
    const key = c.req.query("key");
    if (!key) {
      return c.json(
        {
          success: false,
          message: "`key` query parameter shaardlagatai",
        },
        400,
      );
    }

    const signedUrl = await buildSignedContractUrl(new URL(c.req.url).origin, key, c.env.R2_SIGNING_SECRET);

    return c.json({
      success: true,
      data: {
        key,
        signedUrl,
        ttlSeconds: SIGNED_URL_TTL_SECONDS,
      },
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Generate signed URL error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.get("/contracts/object/:benefitId/:version/:filename", async (c) => {
  try {
    const benefitId = c.req.param("benefitId");
    const version = c.req.param("version");
    const filename = c.req.param("filename");
    const key = `contracts/${decodeURIComponent(benefitId)}/${decodeURIComponent(version)}/${decodeURIComponent(filename)}`;
    const exp = c.req.query("exp");
    const sig = c.req.query("sig");

    if (!exp || !sig) {
      return c.json(
        {
          success: false,
          message: "Signed URL is missing required query params",
        },
        401,
      );
    }

    const expires = Number(exp);
    if (!Number.isFinite(expires) || Math.floor(Date.now() / 1000) > expires) {
      return c.json(
        {
          success: false,
          message: "Signed URL expired",
        },
        401,
      );
    }

    const expectedSig = await signMessage(c.env.R2_SIGNING_SECRET, `${key}:${expires}`);
    if (sig !== expectedSig) {
      return c.json(
        {
          success: false,
          message: "Invalid signature",
        },
        403,
      );
    }

    const object = await c.env.ASSETS.get(key);

    if (!object) {
      return c.json(
        {
          success: false,
          message: "Contract file not found",
        },
        404,
      );
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);

    return new Response(object.body, { headers });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Get contract file error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.all("/graphql", (c) => {
  return yoga.fetch(c.req.raw, c.env, c.executionCtx);
});

export default app;
