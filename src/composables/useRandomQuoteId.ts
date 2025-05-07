import { GET_RANDOM_QUOTE_ID_QUERY } from '@/api/apollo/queries/getRandomQuoteId.query'
import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'

export function useRandomQuoteId() {
  const {
    result,
    refetch,
    loading,
  } = useQuery(GET_RANDOM_QUOTE_ID_QUERY)

  const randomQuoteId = computed(() => result.value?.getRandomQuoteId)

  return {
    randomQuoteId,
    refetchRandomQuoteId: refetch,
    randomQuoteIdLoading: loading,
  }
}
