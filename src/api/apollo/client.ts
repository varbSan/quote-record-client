import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions' // <-- This one uses graphql-ws
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { auth, initAuth } from '../auth'

// eslint-disable-next-line antfu/no-top-level-await
await initAuth()

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_API_URL,
  headers: {
    // eslint-disable-next-line antfu/no-top-level-await
    Authorization: `Bearer ${(await auth.session?.getToken()) ?? ''}`, // Add Clerk token
  },
})

// Create a GraphQLWsLink link:
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

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
})
