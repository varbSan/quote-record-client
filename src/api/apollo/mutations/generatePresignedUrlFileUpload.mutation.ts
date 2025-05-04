import { graphql } from '@/gql'

export const GENERATE_PRESIGNED_URL_FILE_UPLOAD_MUTATION = graphql(`
  mutation GeneratePresignedUrlFileUpload($fileName: String!, $contentType: String!) {
    generatePresignedUrlFileUpload(fileName: $fileName, contentType: $contentType)
  }
`)
