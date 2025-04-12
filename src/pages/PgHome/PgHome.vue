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
    <section class="flex flex-col mx-6 justify-center mb-6">
      <div class="max-w-[35rem] w-full mx-auto flex justify-end">
        <UTabs v-model="activeView" :items="viewItems" size="xs" variant="link" />
      </div>
      <VwCreateQuote
        v-if="activeView === 'VwCreateQuote'"
        class="space-y-4 outline-[0.5px] p-4 rounded-lg max-w-[35rem] w-full mx-auto"
      />
      <VwFileUpload
        v-else
        class="space-y-4 outline-[0.5px] p-4 rounded-lg max-w-[35rem] w-full mx-auto"
      />
    </section>
    <section class="flex flex-col mx-6 justify-center">
      <div class="space-y-4 outline-[0.5px] p-4 rounded-lg max-w-[35rem] w-full mx-auto">
        <p>
          {{ subscriptionText ?? randomTextQuote }}
        </p>
        <div class="flex justify-end mt-auto">
          <UButton :loading="loading" size="sm" icon="i-lucide-refresh-cw" @click="refetchQuery">
            Refetch
          </UButton>
        </div>
      </div>
    </section>
  </main>
</template>
