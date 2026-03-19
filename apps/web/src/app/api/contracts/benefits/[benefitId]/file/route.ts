import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ benefitId: string }> },
) {
  const { benefitId } = await context.params;
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "";

  const graphqlResponse = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query ContractSignedUrlByBenefit($benefitId: ID!) {
          contractSignedUrlByBenefit(benefitId: $benefitId) {
            signedUrl
          }
        }
      `,
      variables: { benefitId },
    }),
  });

  if (!graphqlResponse.ok) {
    return new Response("Failed to load contract metadata.", {
      status: graphqlResponse.status,
    });
  }

  const payload = (await graphqlResponse.json()) as {
    data?: {
      contractSignedUrlByBenefit?: {
        signedUrl?: string | null;
      } | null;
    };
    errors?: Array<{ message?: string }>;
  };

  if (payload.errors?.length) {
    return new Response(
      payload.errors[0]?.message || "Failed to resolve contract URL.",
      {
        status: 502,
      },
    );
  }

  const signedUrl = payload.data?.contractSignedUrlByBenefit?.signedUrl;
  if (!signedUrl) {
    return new Response("No contract PDF found for this benefit.", {
      status: 404,
    });
  }

  const contractUrl = /^https?:\/\//i.test(signedUrl)
    ? signedUrl
    : new URL(signedUrl, new URL(graphqlEndpoint).origin).toString();
  const contractResponse = await fetch(contractUrl, {
    cache: "no-store",
  });

  if (!contractResponse.ok) {
    return new Response("Failed to download contract PDF.", {
      status: contractResponse.status,
    });
  }

  const pdfBytes = await contractResponse.arrayBuffer();

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/pdf",
    },
  });
}
