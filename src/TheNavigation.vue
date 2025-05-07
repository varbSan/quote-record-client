<script setup lang="ts">
import type { BreadcrumbItem, NavigationMenuItem } from '@nuxt/ui'
import type { RouteLocationMatched, RouteLocationNormalizedLoadedGeneric, RouteRecordRaw } from 'vue-router'
import { useScreenSize } from '@/composables/useScreenSize'
import { useSession } from '@clerk/vue'
import { onClickOutside } from '@vueuse/core'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MlNavigationDropdown from './components/molecules/MlNavigationDropdown.vue'
import { routes } from './router/routes'
import { getRouteSiblings } from './utils/getRouteSiblings'

const { isSmallScreen } = useScreenSize()
const { isSignedIn } = useSession()
const route = useRoute()
const { currentRoute } = useRouter()
const matchedRoutes = computed(() => route.matched)
const isNavBarOpen = ref(false)

const breadcrumbsItems = computed( // return current route and its siblings formatted (filter out signin route)
  () => matchedRoutes.value?.map(route => formatBreadcrumbRouteItem(
    route,
    getRouteSiblings(route.name as string, matchedRoutes.value)
      ?.filter(route => !!route.name && route.name !== 'signin' && isSignedIn.value),
  )),
)

const navbar = useTemplateRef<HTMLElement>('navbar')
onClickOutside(navbar, () => isNavBarOpen.value = false)

watch(currentRoute, () => {
  isNavBarOpen.value = false
})

const navBarItems = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: 'Link',
      type: 'label',
    },
    ...routes
      .filter(route => !!route.name && route.name !== 'signin' && isSignedIn.value)
      .map(route => formatNavBarRouteItem(route, route.children)),
  ],
  [
    {
      label: 'bakary.dev',
      icon: 'i-lucide-at-sign',
      badge: '',
      to: 'https://bakary.dev/',
      target: '_blank',
    },
    {
      label: 'Help',
      icon: 'i-lucide-circle-help',
      disabled: true,
    },
  ],
])

function formatBreadcrumbRouteItem(
  route: RouteRecordRaw | RouteLocationNormalizedLoadedGeneric | RouteLocationMatched,
  children: RouteRecordRaw[] = [],

): BreadcrumbItem {
  return {
    slot: 'dropdown' as const,
    label: route.meta?.label as string,
    value: route.name as string,
    icon: route.meta?.icon as string,
    to: { name: route.name },
    children: children.map(child => formatBreadcrumbRouteItem(child)),
  }
}

function formatNavBarRouteItem(
  route: RouteRecordRaw | RouteLocationNormalizedLoadedGeneric | RouteLocationMatched,
  children: RouteRecordRaw[] = [],

): NavigationMenuItem {
  return {
    slot: 'dropdown' as const,
    label: route.meta?.label as string,
    value: route.name as string,
    // active: !!matchedRoutes.value.find((matchedRoute) => matchedRoute.name === route.name),
    defaultOpen: !!matchedRoutes.value.find(matchedRoute => matchedRoute.name === route.name),
    icon: route.meta?.icon as string,
    to: { name: route.name },
    children: children.map(child => formatNavBarRouteItem(child)),
  }
}
</script>

<template>
  <div class="flex gap-x-2 items-center">
    <UDrawer direction="left" :open="isNavBarOpen">
      <UButton
        class="cursor-pointer"
        color="neutral"
        variant="outline"
        icon="i-lucide-menu"
        @click="isNavBarOpen = true"
      />

      <template #content>
        <div ref="navbar">
          <h2 class="pt-4 pl-6 flex items-center font-semibold">
            <UButton
              color="neutral"
              variant="icon"
              class="cursor-pointer p-0 mr-2"
              :to="{ name: 'home' }"
            >
              <UAvatar src="/raccoon_icon.png" size="sm" />
            </UButton>
            Quote Record
          </h2>
          <UNavigationMenu orientation="vertical" :items="navBarItems" class="data-[orientation=vertical]:w-48 py-4 pl-4" />
        </div>
      </template>
    </UDrawer>
    <UButton
      color="neutral"
      variant="icon"
      class="cursor-pointer p-0"
      :to="{ name: 'home' }"
    >
      <UAvatar src="/raccoon_icon.png" size="sm" />
    </UButton>
    <UBreadcrumb v-if="!isSmallScreen" :items="breadcrumbsItems" class="mr-auto">
      <template #dropdown="{ item }">
        <MlNavigationDropdown :item="item" />
      </template>
      <template #separator>
        <span class="text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>
  </div>
</template>
