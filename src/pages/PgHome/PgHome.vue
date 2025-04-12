<script setup lang="ts">
import { GET_RANDOM_QUOTE_RECORD_QUERY } from '@/api/apollo/queries/getRandomQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteRecordCreated.subscription'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { computed, ref } from 'vue'
import VwCreateQuote from './views/VwCreateQuote.vue'
import VwFileUpload from './views/VwFileUpload.vue'

const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)
const { result: resultQuery, refetch: refetchQuery, loading } = useQuery(GET_RANDOM_QUOTE_RECORD_QUERY)

const subscriptionText = computed(() => resultSubscription.value?.quoteRecordCreated.text)
const randomTextQuote = computed(() => resultQuery.value?.getRandomQuoteRecord.text ?? '')

const viewItems = [
  { value: 'VwCreateQuote', icon: 'i-lucide-pen' },
  { value: 'VwFileUpload', icon: 'i-lucide-upload' },
]

const activeView = ref('VwCreateQuote')
</script>

<template>
  <main>
    <section class="grid grid-cols-12 place-items-center mx-6 mt-20">
      <div class="hidden md:block col-span-3" />

      <div class="space-y-4 border-2 p-4 rounded-lg md:col-span-6 w-full col-span-12">
        <p>
          {{ subscriptionText ?? randomTextQuote }}
        </p>
        <div class="flex justify-end mt-auto">
          <UButton :loading="loading" size="sm" icon="i-lucide-refresh-cw" @click="refetchQuery">
            Refetch
          </UButton>
        </div>
      </div>
      <div class="hidden md:block col-span-3" />
    </section>
    <section class="grid grid-cols-12 place-items-center mx-6 mt-20">
      <div class="hidden md:block col-span-3" />
      <div class="md:col-span-6 justify-between ml-auto">
        <UTabs v-model="activeView" :items="viewItems" size="xs" variant="link" />
      </div>
      <div class="hidden md:block col-span-3" />
      <div class="hidden md:block col-span-3" />
      <VwCreateQuote v-if="activeView === 'VwCreateQuote'" class="space-y-4 border-2 p-4 rounded-lg md:col-span-6 w-full col-span-12" />
      <VwFileUpload v-else class="space-y-4 border-2 p-4 rounded-lg md:col-span-6 w-full col-span-12" />
      <div class="hidden md:block col-span-3" />
    </section>
  </main>
</template>
