<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { useRouteParams } from '@/composables/useRouteParams'
import { routes } from '@/router/routes'
import { computed, ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const { currentRoute, push } = useRouter()
const activeView = ref(currentRoute.value.name)
const { getParams } = useRouteParams()
const viewItems = computed<TabsItem[]>(() =>
  routes
    ?.find(route => route.name === 'home')
    ?.children
    ?.map(child => ({
      value: child.name as string,
      icon: child.meta?.icon as string,
      label: child.meta?.label as string,
    }))
    ?? [],
)

watch(currentRoute, () => {
  if (activeView.value !== currentRoute.value.name) {
    activeView.value = currentRoute.value.name as string
  }
})

watch(activeView, () => {
  if (activeView.value !== currentRoute.value.name) {
    push({
      name: activeView.value as string,
      params: getParams(activeView.value as string),
    })
  }
})
</script>

<template>
  <main class="flex flex-col max-w-[35rem] w-full mx-auto">
    <div class="flex justify-end">
      <UTabs v-model="activeView" :items="viewItems" size="xs" variant="link" />
    </div>
    <section class="space-y-4 outline-1 outline-black/15 dark:outline-white/40 rounded-lg p-4 mb-2.5">
      <RouterView />
    </section>
  </main>
</template>
