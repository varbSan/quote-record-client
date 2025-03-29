<script setup lang="ts">
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { CREATE_QUOTE_RECORD_MUTATION } from './api/apollo/mutations/createQuoteRecord.mutation'
import { GET_LAST_QUOTE_RECORD_QUERY } from './api/apollo/queries/getLastQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from './api/apollo/subscriptions/quoteRecordCreated.subscription'

const { result, loading: queryLoading, refetch, error: resultError } = useQuery(GET_LAST_QUOTE_RECORD_QUERY)
const { mutate, loading: mutationLoading, error: mutationError } = useMutation(CREATE_QUOTE_RECORD_MUTATION)
const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)

const fooError = ref()

async function handleCreate() {
  try {
    await mutate({ text: 'Hello World' })
  }
  catch (err) {
    fooError.value = resultError.value ?? mutationError.value ?? err
  }
}
</script>

<template>
  <UApp>
    <RouterView />
    <br>
    {{ resultSubscription?.quoteRecordCreated.text }}
    <br>

    <UButton :loading="mutationLoading" @click="handleCreate">
      create
    </UButton>
    <br>
    <UButton :loading="queryLoading" @click="refetch">
      refetch
    </UButton>
    <br>
    {{ result?.getLastQuoteRecord }}
    <br>
    <br>
    {{ fooError?.name ?? '' }}
    {{ fooError?.message ?? '' }}
    {{ fooError?.stack ?? '' }}
  </UApp>
</template>
