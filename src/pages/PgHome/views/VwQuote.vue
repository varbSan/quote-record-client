<script setup lang="ts">
import { GET_RANDOM_QUOTE_RECORD_QUERY } from '@/api/apollo/queries/getRandomQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteRecordCreated.subscription'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'

const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)
const { result: resultQuery, refetch: refetchQuery, loading } = useQuery(GET_RANDOM_QUOTE_RECORD_QUERY)

const subscriptionText = computed(() => resultSubscription.value?.quoteRecordCreated.text ?? '')
const randomTextQuote = computed(() => resultQuery.value?.getRandomQuoteRecord.text ?? '')

const quoteDisplayed = ref('')
watch(randomTextQuote, () => {
  quoteDisplayed.value = randomTextQuote.value
}, { immediate: true })

watch(subscriptionText, () => {
  quoteDisplayed.value = subscriptionText.value
}, { immediate: true })
</script>

<template>
  <div>
    <p>
      {{ quoteDisplayed }}
    </p>
    <div class="flex justify-end mt-auto">
      <UButton :loading="loading" size="sm" icon="i-lucide-refresh-cw" @click="refetchQuery">
        Refetch
      </UButton>
    </div>
  </div>
</template>
