<script setup lang="ts">
import { GET_RANDOM_QUOTE_QUERY } from '@/api/apollo/queries/getRandomQuote.query'
import { QUOTE_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteCreated.subscription'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'

const { result: resultSubscription } = useSubscription(QUOTE_CREATED_SUBSCRIPTION)
const { result: resultQuery, refetch: refetchQuery, loading } = useQuery(GET_RANDOM_QUOTE_QUERY)

const subscriptionText = computed(() => resultSubscription.value?.quoteCreated.text ?? '')
const randomTextQuote = computed(() => resultQuery.value?.getRandomQuote.text ?? '')

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
