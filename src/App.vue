<script setup lang="ts">
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { CREATE_QUEUE_POINT_MUTATION } from './api/apollo/mutations/createQueuePoint.mutation'
import { GET_LAST_QUEUE_POINT_QUERY } from './api/apollo/queries/getLastQueuePoint.query'
import { QUEUE_POINT_CREATED_SUBSCRIPTION } from './api/apollo/subscriptions/queuePointCreated.subscription'

const { result, loading: queryLoading, refetch, error: resultError } = useQuery(GET_LAST_QUEUE_POINT_QUERY)
const { mutate, loading: mutationLoading, error: mutationError } = useMutation(CREATE_QUEUE_POINT_MUTATION)
const { result: resultSubscription } = useSubscription(QUEUE_POINT_CREATED_SUBSCRIPTION)

const fooError = ref()

async function handleCreate() {
  try {
    await mutate({ row: 4 })
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
    {{ resultSubscription?.queuePointCreated.id }}
    <br>

    <UButton :loading="mutationLoading" @click="handleCreate">
      create
    </UButton>
    <br>
    <UButton :loading="queryLoading" @click="refetch">
      refetch
    </UButton>
    <br>
    {{ result?.getLastQueuePoint }}
    <br>
    <br>
    {{ fooError?.name ?? '' }}
    {{ fooError?.message ?? '' }}
    {{ fooError?.stack ?? '' }}
  </UApp>
</template>
