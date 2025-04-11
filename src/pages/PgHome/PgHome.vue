<script setup lang="ts">
import { GET_RANDOM_QUOTE_RECORD_QUERY } from '@/api/apollo/queries/getRandomQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteRecordCreated.subscription'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { computed } from 'vue'
import VwCreateQuote from './views/VwCreateQuote.vue'
import VwFileUpload from './views/VwFileUpload.vue'

const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)
const { result: resultQuery, refetch: refetchQuery, loading } = useQuery(GET_RANDOM_QUOTE_RECORD_QUERY)

const subscriptionText = computed(() => resultSubscription.value?.quoteRecordCreated.text)
const randomTextQuote = computed(() => resultQuery.value?.getRandomQuoteRecord.text ?? '')
</script>

<template>
  <main>
    <section class="flex justify-center mx-6">
      <div class="flex flex-col space-y-4 border-2 p-4">
        <p>
          {{ subscriptionText ?? randomTextQuote }}
        </p>
        <div class="flex justify-end mt-auto">
          <UButton :loading="loading" @click="refetchQuery">
            Refetch
          </UButton>
        </div>
      </div>
    </section>
    <section class="grid grid-cols-12 place-items-center mx-6 gap-6 m-6">
      <div class="hidden md:block col-span-1 " />
      <VwCreateQuote class="space-y-4 border-2 p-4 md:col-span-5 w-full col-span-12" />
      <VwFileUpload class="space-y-4 border-2 p-4 md:col-span-5 w-full col-span-12" />
      <div class="hidden md:block col-span-1" />
    </section>
  </main>
</template>
