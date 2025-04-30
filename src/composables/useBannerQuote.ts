import { UPDATE_QUOTE_MUTATION } from '@/api/apollo/mutations/updateQuote.mutation'
import { GET_RANDOM_QUOTE_QUERY } from '@/api/apollo/queries/getRandomQuote.query'
import { QUOTE_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteCreated.subscription'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useRouter } from '@nuxt/ui/runtime/vue/stubs.js'
import { useLazyQuery, useMutation, useSubscription } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'

export function useBannerQuote() {
  const {
    mutate: updateQuote,
    loading: updateQuoteLoading,
    error: updateQuoteError,
  } = useMutation(UPDATE_QUOTE_MUTATION)

  const { result: resultSubscription } = useSubscription(QUOTE_CREATED_SUBSCRIPTION)
  const { load, result: resultQuery, refetch: refetchRandomQuote, loading: randomQuoteLoading } = useLazyQuery(
    GET_RANDOM_QUOTE_QUERY,
    undefined,
    { fetchPolicy: 'network-only' },
  )

  const { currentRoute } = useRouter()
  const toast = useToast()

  const subscriptionQuote = computed(() => resultSubscription.value?.quoteCreated)
  const randomQuote = computed(() => resultQuery.value?.getRandomQuote)

  const bannerQuote = ref<typeof subscriptionQuote.value | typeof randomQuote.value>()

  watch([currentRoute], async () => {
    await load()
    bannerQuote.value = subscriptionQuote.value ?? randomQuote.value
  }, { immediate: true })

  async function refetchBannerQuote() {
    await refetchRandomQuote()
    bannerQuote.value = randomQuote.value
  }

  async function updateBannerQuote(text: string) {
    try {
      if (!bannerQuote.value?.id) {
        throw new Error('Invalid quote id')
      }
      const res = await updateQuote({ updateQuoteInput: { id: bannerQuote.value?.id, text } })
      bannerQuote.value = res?.data?.updateQuote
      toast.add({ title: 'Success', description: 'Quote updated successfully!', color: 'success' })
    }
    catch (err) {
      toast.add({ title: 'Error', description: updateQuoteError.value?.message ?? err?.toString() ?? '', color: 'error' })
    }
  }

  return {
    bannerQuote,
    refetchBannerQuote,
    updateBannerQuote,
    updateBannerQuoteLoading: updateQuoteLoading,
    randomQuoteLoading,
  }
}
