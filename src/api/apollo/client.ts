import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { auth, initAuth } from '../auth'

export async function createApolloClient() {
  await initAuth()

  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_URL,
  })

  const authLink = setContext(async (_, { headers }) => {
    const token = await auth.session?.getToken()
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  const wsLink = new GraphQLWsLink(
    createClient({
      url: import.meta.env.VITE_API_URL_WS,
      connectionParams: async () => {
        return {
          headers: {
            Authorization: `Bearer ${(await auth.session?.getToken()) ?? ''}`,
          },
        }
      },
    }),
  )

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription'
      )
    },
    wsLink,
    authLink.concat(httpLink),
  )

  const cache = new InMemoryCache()

  return new ApolloClient({
    link,
    cache,
  })
}
