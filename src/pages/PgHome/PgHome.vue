<script setup lang="ts">
import { GET_RANDOM_QUOTE_RECORD_QUERY } from '@/api/apollo/queries/getRandomQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteRecordCreated.subscription'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'
import VwCreateQuote from './views/VwCreateQuote.vue'
import VwCreateUser from './views/VwCreateUser.vue'
import VwFileUpload from './views/VwFileUpload.vue'

const { result: resultQuery, refetch: refetchQuery, loading } = useQuery(GET_RANDOM_QUOTE_RECORD_QUERY)
const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)

const randomTextQuote = computed(
  () => resultSubscription.value?.quoteRecordCreated.text ?? resultQuery.value?.getRandomQuoteRecord.text ?? '',
)

const subscriptionText = ref()
watch(resultSubscription, () => {
  subscriptionText.value = resultSubscription.value?.quoteRecordCreated.text
})
</script>

<template>
  <main>
    <section class="flex justify-center mx-6">
      <div class="flex flex-col space-y-4 border-2 p-4">
        <p>
          {{ randomTextQuote }}
        </p>
        <div class="flex justify-end mt-auto">
          <UButton :loading="loading" @click="refetchQuery">
            Refetch
          </UButton>
        </div>
      </div>
    </section>
    <section class="grid md:grid-cols-3 gap-6 m-6">
      <VwCreateUser class="space-y-4 border-2 p-4" />
      <VwCreateQuote class="space-y-4 border-2 p-4" />
      <VwFileUpload class="space-y-4 border-2 p-4" />
    </section>
  </main>
</template>
