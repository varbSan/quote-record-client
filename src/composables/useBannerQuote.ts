import { GENERATE_QUOTE_IMAGE_MUTATION } from '@/api/apollo/mutations/generateQuoteImage.mutation'
import { UPDATE_QUOTE_MUTATION } from '@/api/apollo/mutations/updateQuote.mutation'
import { GET_QUOTE_QUERY } from '@/api/apollo/queries/getQuote.query'
import { GET_RANDOM_QUOTE_QUERY } from '@/api/apollo/queries/getRandomQuote.query'
import { QUOTE_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteCreated.subscription'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useRouter } from '@nuxt/ui/runtime/vue/stubs.js'
import { useLazyQuery, useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'

export function useBannerQuote() {
  const { result: subscriptionQuoteResult } = useSubscription(QUOTE_CREATED_SUBSCRIPTION)

  const {
    load: getQuote,
    result: getQuoteResult,
  } = useLazyQuery(GET_QUOTE_QUERY, undefined, { fetchPolicy: 'network-only' })

  const {
    result: randomQuoteResult,
    refetch: refetchRandomQuote,
    loading: randomQuoteLoading,
  } = useQuery(GET_RANDOM_QUOTE_QUERY, undefined, { fetchPolicy: 'network-only' })

  const {
    mutate: updateQuote,
    loading: updateQuoteLoading,
    error: updateQuoteError,
  } = useMutation(UPDATE_QUOTE_MUTATION)

  const {
    mutate: generateQuoteImage,
    loading: generateQuoteImageLoading,
  } = useMutation(GENERATE_QUOTE_IMAGE_MUTATION)

  const { currentRoute } = useRouter()
  const toast = useToast()

  const subscriptionQuote = computed(() => subscriptionQuoteResult.value?.quoteCreated)
  const randomQuote = computed(() => randomQuoteResult.value?.getRandomQuote)
  const swappingQuote = computed(() => getQuoteResult.value?.getQuote)

  const bannerQuote = ref<typeof subscriptionQuote.value | typeof randomQuote.value | typeof swappingQuote.value>()

  watch([currentRoute, randomQuote], async () => {
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

  async function swapBannerQuote(id: number) {
    return getQuote(undefined, { quoteId: id }, { fetchPolicy: 'network-only' })
  }

  watch(swappingQuote, () => {
    bannerQuote.value = swappingQuote.value
  })

  return {
    bannerQuote,
    refetchBannerQuote,
    updateBannerQuote,
    updateBannerQuoteLoading: updateQuoteLoading,
    randomQuoteLoading,
    generateBannerQuoteImage: generateQuoteImage,
    generateBannerQuoteImageLoading: generateQuoteImageLoading,
    swapBannerQuote,
  }
}
