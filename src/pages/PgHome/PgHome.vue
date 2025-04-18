<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { GET_RANDOM_QUOTE_RECORD_QUERY } from '@/api/apollo/queries/getRandomQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from '@/api/apollo/subscriptions/quoteRecordCreated.subscription'
import { routes } from '@/router/routes'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)
const { result: resultQuery, refetch: refetchQuery, loading } = useQuery(GET_RANDOM_QUOTE_RECORD_QUERY)

const subscriptionText = computed(() => resultSubscription.value?.quoteRecordCreated.text)
const randomTextQuote = computed(() => resultQuery.value?.getRandomQuoteRecord.text ?? '')

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
    <section class="space-y-4 outline-[0.5px] rounded-lg p-4 mb-2.5">
      <RouterView />
    </section>
    <section class="space-y-4 outline-[0.5px] rounded-lg p-4">
      <p>
        {{ subscriptionText ?? randomTextQuote }}
      </p>
      <div class="flex justify-end mt-auto">
        <UButton :loading="loading" size="sm" icon="i-lucide-refresh-cw" @click="refetchQuery">
          Refetch
        </UButton>
      </div>
    </section>
  </main>
</template>
