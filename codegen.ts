import type { CodegenConfig } from '@graphql-codegen/cli'
import process from 'node:process'
import 'dotenv/config'

const isDevelopment = process.env.VITE_NODE_ENV === 'development'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.VITE_SCHEMA_PATH,
  documents: ['src/**/*.{query,mutation,subscription}.ts'],
  ignoreNoDocuments: true,
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
    ...(isDevelopment && {
      './graphql.schema.json': {
        plugins: ['introspection'],
      },
    }),
  },
}

export default config
