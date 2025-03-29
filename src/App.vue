<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import * as v from 'valibot'
import { computed, reactive, ref, watch } from 'vue'

import { RouterView } from 'vue-router'
import { CREATE_QUOTE_RECORD_MUTATION } from './api/apollo/mutations/createQuoteRecord.mutation'
import { GET_LAST_QUOTE_RECORD_QUERY } from './api/apollo/queries/getLastQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from './api/apollo/subscriptions/quoteRecordCreated.subscription'

const { result: resultQuery, loading: queryLoading, refetch } = useQuery(GET_LAST_QUOTE_RECORD_QUERY)
const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)
const { mutate, loading: mutationLoading, error: mutationError } = useMutation(CREATE_QUOTE_RECORD_MUTATION)

const toast = useToast()

const lastTextQuote = computed(() => resultSubscription.value?.quoteRecordCreated.text ?? resultQuery.value?.getLastQuoteRecord.text ?? '')
const schema = v.object({
  quoteRecordText: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  quoteRecordText: '',
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await mutate({ text: event.data.quoteRecordText })
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: mutationError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}
const subscriptionText = ref()
watch(resultSubscription, () => {
  subscriptionText.value = resultSubscription.value?.quoteRecordCreated.text
})
</script>

<template>
  <UApp>
    <RouterView />
    <br>
    {{ lastTextQuote }}
    <br>

    <UForm :schema="schema" :state="state" class="space-y-4 border-2 p-4 m-4" @submit="onSubmit">
      <UFormField label="quote" name="quoteRecordText">
        <UInput v-model="state.quoteRecordText " />
      </UFormField>

      <UButton :loading="mutationLoading" type="submit">
        create
      </UButton>
    </UForm>
    <br>
    <UButton :loading="queryLoading" @click="refetch">
      refetch
    </UButton>
  </UApp>
</template>
