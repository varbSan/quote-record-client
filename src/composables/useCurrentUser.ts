import { GET_CURRENT_USER_QUERY } from '@/api/apollo/queries/getCurrentUser.query'
import { useAuth } from '@clerk/vue'
import { useQuery } from '@vue/apollo-composable'
import { computed, watch } from 'vue'

export function useCurrentUser() {
  const { userId, isSignedIn, isLoaded: isAuthLoaded } = useAuth()
  const { result, refetch } = useQuery(GET_CURRENT_USER_QUERY)

  const currentUser = computed(() => userId.value && isSignedIn.value ? result.value?.getCurrentUser : undefined)

  watch([userId, isAuthLoaded, isSignedIn], () => {
    if (isAuthLoaded) {
      refetch()
    }
  }, { immediate: true })

  return {
    currentUser,
    isAuthLoaded,
  }
}
