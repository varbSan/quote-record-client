import type { CodegenConfig } from '@graphql-codegen/cli'
import process from 'node:process'
import 'dotenv/config'

const isDevelopment = process.env.VITE_NODE_ENV === 'development'

const config: CodegenConfig = {
  overwrite: true,
  watch: isDevelopment,
  schema: isDevelopment ? process.env.VITE_API_URL : './graphql.schema.json',
  documents: ['src/**/*.query.ts', 'src/**/*.mutation.ts', 'src/**/*.subscription.ts'],
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [],
    },
    ...(isDevelopment && {
      './graphql.schema.json': {
        plugins: ['introspection'],
      },
    }),
  },
}

export default config
