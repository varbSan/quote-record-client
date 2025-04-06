import { graphql } from '@/gql'

export const CREATE_USER_MUTATION = graphql(`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      email
      username
      tosAcceptedAt
      createdAt
      updatedAt
    }
  }
`)
