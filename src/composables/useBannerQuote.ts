import { GET_RANDOM_QUOTE_QUERY } from '@/api/apollo/queries/getRandomQuote.query'
import { QUOTE_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteCreated.subscription'
import { useRouter } from '@nuxt/ui/runtime/vue/stubs.js'
import { useLazyQuery, useSubscription } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'

export function useBannerQuote() {
  const { result: resultSubscription } = useSubscription(QUOTE_CREATED_SUBSCRIPTION)
  const { load, result: randomQuote, refetch: refetchRandomQuote, loading: randomQuoteLoading } = useLazyQuery(
    GET_RANDOM_QUOTE_QUERY,
    undefined,
    { fetchPolicy: 'network-only' },
  )

  const { currentRoute } = useRouter()
  const bannerQuote = ref('')

  const subscriptionText = computed(() => resultSubscription.value?.quoteCreated.text)
  const randomQuoteText = computed(() => randomQuote.value?.getRandomQuote.text)

  watch([currentRoute], async () => {
    await load()
    bannerQuote.value = subscriptionText.value ?? randomQuoteText.value ?? ''
  }, { immediate: true })

  async function handleRefetchRandomQuote() {
    await refetchRandomQuote()
    bannerQuote.value = randomQuoteText.value ?? ''
  }

  return {
    bannerQuote,
    handleRefetchRandomQuote,
    randomQuoteLoading,
  }
}
