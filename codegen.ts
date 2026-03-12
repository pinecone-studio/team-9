import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  documents: [
    "apps/web/src/**/*.{ts,tsx}",
    "!apps/web/src/lib/apollo/__generated__/**/*",
  ],
  generates: {
    "apps/web/src/lib/apollo/__generated__/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        documentMode: "graphQLTag",
        gqlImport: "@apollo/client#gql",
        useTypeImports: true,
      },
    },
  },
  ignoreNoDocuments: false,
  schema: "apps/api/src/graphql/schema.ts",
};

export default config;
