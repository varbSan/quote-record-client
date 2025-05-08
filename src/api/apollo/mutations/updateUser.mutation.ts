import { graphql } from '@/gql'

export const UPDATE_USER_MUTATION = graphql(`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      email
      username
      seePublicQuotes
      createdAt
      updatedAt
    }
  }
`)
