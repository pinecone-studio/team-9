import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [{ 'apps/api/src/graphql/schema.ts': { noRequire: true } }],
  documents: ['apps/web/src/**/*.{ts,tsx,graphql}'],
  ignoreNoDocuments: true,
  config: {
    withHooks: true,
    withHOC: false,
    withComponent: false,
    withMutationFn: false,
    withMutationOptionsType: false,
    reactApolloVersion: 3,
    apolloReactCommonImportFrom: '@apollo/client/react',
    apolloReactHooksImportFrom: '@apollo/client/react',
    gqlImport: '@apollo/client#gql',
  },
  generates: {
    'apps/web/src/shared/apollo/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    },
  },
};

export default config;
