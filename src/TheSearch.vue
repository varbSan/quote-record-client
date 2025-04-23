<script setup lang="ts">
import type { CommandPaletteItem } from '@nuxt/ui'
import type { RouteLocationMatched, RouteLocationNormalizedLoadedGeneric, RouteRecordRaw } from 'vue-router'
import type { GetQuotesQuery } from './gql/graphql'
import { useSession } from '@clerk/vue'
import { defineShortcuts } from '@nuxt/ui/runtime/composables/defineShortcuts.js'
import { useLazyQuery } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { GET_QUOTES_QUERY } from './api/apollo/queries/getQuotes.query'
import { routes } from './router/routes'

const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'xs',
})
const { isSignedIn } = useSession()

const { push } = useRouter()

const isSearchModalOpen = ref(false)
const searchTerm = ref('')

const { result, load } = useLazyQuery(GET_QUOTES_QUERY)
watch(searchTerm, () => {
  load(
    GET_QUOTES_QUERY,
    { searchTerm: searchTerm.value },
    { fetchPolicy: 'network-only' },
  )
}, { immediate: true })

const searchItems = computed(() => [{
  id: 'quotes',
  label: searchTerm.value ? `Quotes matching “${searchTerm.value}”...` : 'Quotes',
  items: result.value?.getQuotes.map(quote => formatQuoteItem(quote)) ?? [],
}, {
  id: 'routes',
  label: searchTerm.value ? `Routes matching “${searchTerm.value}”...` : 'Routes',
  items: routes
    .filter(route => !!route.name && route.name !== 'signin' && isSignedIn.value)
    .map(route => formatRouteItem(route, route.children)),
}])

defineShortcuts({
  meta_k: () => {
    isSearchModalOpen.value = !isSearchModalOpen.value
  },
})

function formatRouteItem(
  route: RouteRecordRaw | RouteLocationNormalizedLoadedGeneric | RouteLocationMatched,
  siblings: RouteRecordRaw[] = [],
): CommandPaletteItem {
  const children = siblings.map(sibling => formatRouteItem(sibling))
  return {
    slot: 'dropdown' as const,
    label: route.meta?.label as string,
    value: route.name as string,
    icon: route.meta?.icon as string,
    to: { name: route.name },
    children,
  }
}

function formatQuoteItem(quote: GetQuotesQuery['getQuotes'][number]): CommandPaletteItem {
  return {
    slot: 'dropdown' as const,
    label: quote.text,
    value: quote.id,
    onSelect: (event: Event) => {
      push({
        name: 'quotes',
        query: { searchTerm: event?.target?.nodeName === 'BUTTON' ? searchTerm.value : quote.text },
      })
      isSearchModalOpen.value = false
    },
  }
}
</script>

<template>
  <UModal v-model:open="isSearchModalOpen">
    <UButton
      color="neutral"
      :size="props.size"
      variant="outline"
      icon="i-lucide-search"
      class="cursor-pointer flex justify-start min-w-48"
      @click="isSearchModalOpen = true"
    >
      <span>
        {{ 'Search quotes...' }}
      </span>
      <span class="ml-auto">
        {{ '⌘K' }}
      </span>
    </UButton>

    <template #content>
      <UCommandPalette
        v-if="isSignedIn"
        v-model:search-term="searchTerm"
        :groups="searchItems"
        placeholder="Search for a quote..."
        class="h-80"
      />
    </template>
  </UModal>
</template>
