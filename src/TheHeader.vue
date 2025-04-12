<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { RouteLocationMatched, RouteLocationNormalizedLoadedGeneric, RouteRecordRaw } from 'vue-router'
import { UserButton, useSession } from '@clerk/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MlNavigationDropdown from './components/molecules/MlNavigationDropdown.vue'
import { useTheme } from './composables/useTheme'
import { getRouteSiblings } from './utils/getRouteSiblings'

const { isSignedIn } = useSession()
const route = useRoute()
const { authBaseTheme, colorMode } = useTheme()

const matchedRoutes = computed(() => route.matched)

const breadcrumbsItems = computed( // return current route and its siblings formatted (filter out signin route)
  () => matchedRoutes.value
    ?.map(route => formatRoute(
      route,
      getRouteSiblings(route.name as string, matchedRoutes.value)?.filter(route => route.name !== 'signin' && isSignedIn.value),
    )
  ),
)

function formatRoute(
  route: RouteRecordRaw | RouteLocationNormalizedLoadedGeneric | RouteLocationMatched,
  siblings: RouteRecordRaw[] = [],
): BreadcrumbItem {
  const children = siblings.map(sibling => formatRoute(sibling))
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
  <header class="flex justify-end gap-x-2 py-3 mb-3 items-center px-4">
    <UButton
      color="neutral"
      variant="icon"
      class="cursor-pointer"
      :to="{ name: 'home' }"
    >
      <UAvatar src="/raccoon_icon.png" />
    </UButton>

    <UBreadcrumb :items="breadcrumbsItems" class="mr-auto">
      <template #dropdown="{ item }">
        <MlNavigationDropdown :item="item" />
      </template>
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>

    <UButton
      :icon="colorMode === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
      color="neutral"
      size="sm"
      variant="outline"
      class="cursor-pointer ml-auto"
      @click="colorMode = colorMode === 'dark' ? 'light' : 'dark'"
    />
    <UserButton
      v-if="isSignedIn"
      :appearance="authBaseTheme"
      :user-profile-props="{
        appearance: authBaseTheme,
      }"
    />
  </header>
</template>
