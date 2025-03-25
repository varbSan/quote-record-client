import type { App } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './client'

export function registerApollo(app: App) {
  app.provide(DefaultApolloClient, apolloClient)
}
