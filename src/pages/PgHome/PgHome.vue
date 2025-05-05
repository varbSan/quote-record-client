<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { routes } from '@/router/routes'
import { computed, ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const { currentRoute, push } = useRouter()
const activeView = ref(currentRoute.value.name)
const viewItems = computed<TabsItem[]>(() =>
  routes
    ?.find(route => route.name === 'home')
    ?.children
    ?.map(child => ({ value: child.name as string, icon: child.meta?.icon as string }))
    ?? [],
)

watch(currentRoute, () => {
  if (activeView.value !== currentRoute.value.name) {
    activeView.value = currentRoute.value.name as string
  }
})

watch(activeView, () => {
  if (activeView.value !== currentRoute.value.name) {
    push({ name: activeView.value as string })
  }
})
</script>

<template>
  <main class="flex flex-col max-w-[35rem] w-full mx-auto">
    <div class="flex justify-end">
      <UTabs v-model="activeView" :items="viewItems" size="xs" />
    </div>
    <section class="space-y-4 outline-1 md:outline-[0.5px] outline-white/40 rounded-lg p-4 mb-2.5">
      <RouterView />
    </section>
  </main>
</template>
