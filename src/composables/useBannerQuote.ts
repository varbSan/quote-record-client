import { GENERATE_QUOTE_IMAGE_MUTATION } from '@/api/apollo/mutations/generateQuoteImage.mutation'
import { UPDATE_QUOTE_MUTATION } from '@/api/apollo/mutations/updateQuote.mutation'
import { GET_QUOTE_QUERY } from '@/api/apollo/queries/getQuote.query'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRandomQuoteId } from './useRandomQuoteId'

export function useBannerQuote() {
  const route = useRoute()
  const { push } = useRouter()
  const toast = useToast()
  const { randomQuoteId } = useRandomQuoteId()

  const {
    result: getQuoteResult,
    refetch: refetchQuote,
    loading: quoteLoading,
  } = useQuery(GET_QUOTE_QUERY, { quoteId: Number(route.params.quoteId) })

  const {
    mutate: updateQuote,
    loading: updateQuoteLoading,
    error: updateQuoteError,
  } = useMutation(UPDATE_QUOTE_MUTATION)

  const {
    mutate: generateQuoteImage,
    loading: generateQuoteImageLoading,
  } = useMutation(GENERATE_QUOTE_IMAGE_MUTATION)

  const routeQuoteId = computed(() => route.params.quoteId)
  watch([routeQuoteId, randomQuoteId], () => {
    if (routeQuoteId.value === '0' && randomQuoteId.value) {
      push({ name: 'quote', params: { quoteId: randomQuoteId.value } })
    }
    else {
      refetchQuote({ quoteId: Number(routeQuoteId.value) })
    }
  }, { immediate: true })

  const bannerQuote = computed(() => getQuoteResult.value?.getQuote)

  async function updateBannerQuote(text: string) {
    try {
      if (!bannerQuote.value?.id) {
        throw new Error('Invalid quote id')
      }
      await updateQuote({ updateQuoteInput: { id: bannerQuote.value?.id, text } })
      toast.add({ title: 'Success', description: 'Quote updated successfully!', color: 'success' })
    }
    catch (err) {
      toast.add({ title: 'Error', description: updateQuoteError.value?.message ?? err?.toString() ?? '', color: 'error' })
    }
  }

  return {
    bannerQuote,
    quoteLoading,
    refetchQuote,
    updateBannerQuote,
    updateBannerQuoteLoading: updateQuoteLoading,
    generateBannerQuoteImage: generateQuoteImage,
    generateBannerQuoteImageLoading: generateQuoteImageLoading,
  }
}
