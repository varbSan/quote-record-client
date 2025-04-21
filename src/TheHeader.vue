<script setup lang="ts">
import type { CommandPaletteItem } from '@nuxt/ui'
import type { RouteLocationMatched, RouteLocationNormalizedLoadedGeneric, RouteRecordRaw } from 'vue-router'
import { UserButton, useSession } from '@clerk/vue'
import { defineShortcuts } from '@nuxt/ui/runtime/composables/defineShortcuts.js'
import { computed, ref } from 'vue'
import { useTheme } from './composables/useTheme'
import { routes } from './router/routes'
import TheNavigation from './TheNavigation.vue'

const { isSignedIn } = useSession()
const { authBaseTheme, colorMode } = useTheme()

const isSearchModalOpen = ref(false)
const searchTerm = ref('')
const searchItems = computed(() => [{
  id: 'quotes',
  label: searchTerm.value ? `Quotes matching “${searchTerm.value}”...` : 'Quotes',
  items: routes
    .filter(route => !!route.name && route.name !== 'signin' && isSignedIn.value)
    .map(route => formatSearchRouteItem(route, route.children)),
}, {
  id: 'routes',
  label: searchTerm.value ? `Routes matching “${searchTerm.value}”...` : 'Routes',
  items: routes
    .filter(route => !!route.name && route.name !== 'signin' && isSignedIn.value)
    .map(route => formatSearchRouteItem(route, route.children)),
}])

defineShortcuts({
  meta_k: () => {
    isSearchModalOpen.value = !isSearchModalOpen.value
  },
})

function formatSearchRouteItem(
  route: RouteRecordRaw | RouteLocationNormalizedLoadedGeneric | RouteLocationMatched,
  siblings: RouteRecordRaw[] = [],
): CommandPaletteItem {
  const children = siblings.map(sibling => formatSearchRouteItem(sibling))
  return {
    slot: 'dropdown' as const,
    label: route.meta?.label as string,
    value: route.name as string,
    icon: route.meta?.icon as string,
    to: { name: route.name },
    children,
  }
}
</script>

<template>
  <header class="flex justify-end gap-x-2 items-center">
    <TheNavigation />
    <UModal v-model:open="isSearchModalOpen" class="ml-auto">
      <UButton
        color="neutral"
        variant="outline"
        size="xs"
        icon="i-lucide-search"
        @click="isSearchModalOpen = true"
      />

      <template #content>
        <UCommandPalette
          v-model:search-term="searchTerm"
          :groups="searchItems"
          placeholder="Search..."
          class="h-80"
          @keyup.enter="isSearchModalOpen = false"
        />
      </template>
    </UModal>
    <UButton
      :icon="colorMode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="neutral"
      size="xs"
      variant="outline"
      class="cursor-pointer"
      @click="colorMode = colorMode === 'dark' ? 'light' : 'dark'"
    />
    <UserButton
      v-if="isSignedIn"
      :appearance="authBaseTheme"
      :user-profile-props="{ appearance: authBaseTheme }"
    />
  </header>
</template>
