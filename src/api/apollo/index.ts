import type { App } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createApolloClient } from './client'

export async function registerApollo(app: App) {
  app.provide(DefaultApolloClient, await createApolloClient())
}
