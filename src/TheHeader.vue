<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import type { RouteLocationMatched, RouteLocationNormalizedLoadedGeneric, RouteRecordRaw } from 'vue-router'
import { dark, neobrutalism } from '@clerk/themes'
import { useAuth, UserButton } from '@clerk/vue'
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRouteSiblings } from './utils/getRouteSiblings'

const { isSignedIn } = useAuth()
const colorMode = useColorMode()
const { currentRoute } = useRouter()
const route = useRoute()
const matched = computed(() => route.matched)

const breadcrumbsItems = computed(
  () => matched.value?.map(route => formatRoute(
    route,
    getRouteSiblings(route.name as string, matched.value),
  )),
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

    <UBreadcrumb :items="breadcrumbsItems">
      <template #dropdown="{ item }">
        <UDropdownMenu v-if="item.children" :items="item.children" class="cursor-pointer">
          <UButton
            :icon="item.icon"
            :label="item.label"
            :color="currentRoute?.name === item.value ? 'primary' : 'neutral'"
            variant="link"
            class="p-0.5"
          />
        </UDropdownMenu>
        <UButton
          v-else
          :icon="item.icon"
          :label="item.label" color="neutral" variant="link" class="p-0.5" :to="item.to"
        />
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
    <UserButton v-if="isSignedIn" :appearance="{ baseTheme: colorMode === 'dark' ? dark : neobrutalism }" />
  </header>
</template>
