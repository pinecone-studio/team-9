import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GRAPHQL_ENDPOINT:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
      process.env.GRAPHQL_ENDPOINT ||
      "",
  },
  output: "export",
  reactCompiler: true,
};

export default nextConfig;
