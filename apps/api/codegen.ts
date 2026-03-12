import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [{ 'apps/api/src/graphql/schema.ts': { noRequire: true } }],
  generates: {
    'apps/api/src/graphql/generated/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default config;
