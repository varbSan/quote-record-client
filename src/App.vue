<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { CREATE_QUEUE_POINT_MUTATION } from './api/apollo/mutations/createQueuePoint.mutation'
import { GET_LAST_QUEUE_POINT_QUERY } from './api/apollo/queries/getLastQueuePoint.query'

const { result, loading: queryLoading, refetch, error: resultError } = useQuery(GET_LAST_QUEUE_POINT_QUERY)
const { mutate, loading: mutationLoading, error: mutationError } = useMutation(CREATE_QUEUE_POINT_MUTATION)

const fooError = ref()

async function handleCreate() {
  try {
    await mutate({ row: 4 }, { update: cache => cache.evict({ fieldName: 'getLastQueuePoint' }) })
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
    {{ result?.getLastQueuePoint }}
    <UButton :loading="mutationLoading" @click="handleCreate">
      create
    </UButton>
    <UButton :loading="queryLoading" @click="refetch">
      refetch
    </UButton>
    {{ fooError?.name ?? '' }}
    {{ fooError?.message ?? '' }}
    {{ fooError?.stack ?? '' }}
  </UApp>
</template>
