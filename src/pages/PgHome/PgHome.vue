<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { UPDATE_USER_MUTATION } from '@/api/apollo/mutations/updateUser.mutation'
import { useBannerQuote } from '@/composables/useBannerQuote'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useRouteParams } from '@/composables/useRouteParams'
import { routes } from '@/router/routes'
import { useMutation } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

const { mutate: updateUser } = useMutation(UPDATE_USER_MUTATION)

const toast = useToast()
const { refetchQuote } = useBannerQuote()
const { currentUser } = useCurrentUser()
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

async function handleUpdateSeePublicQuotes() {
  const updateUserInput = { seePublicQuotes: !currentUser.value?.seePublicQuotes }
  try {

    const res = await updateUser({ updateUserInput }, {
      update: (cache) => { cache.evict({ fieldName: 'getQuotes' }); refetchQuote() },
    })
    const seePublicQuotes = res?.data?.updateUser.seePublicQuotes
    toast.add({ title: 'Success', description: `Community public quotes are now ${seePublicQuotes ? 'visible' : 'hidden'}!`, color: 'success' })
  } catch (err) {
    console.error(err)
    toast.add({ title: 'Error', description: 'Something went wrong. Please try again later.', color: 'error' })
  }
}

</script>

<template>
  <main class="flex flex-col max-w-[35rem] w-full mx-auto">
    <div class="flex justify-between items-center">
      <UButton
        class="cursor-pointer dark:text-white/40 text-black/30"
        variant="outline"
        :label="!!currentUser?.quoteCount ? undefined : (currentUser?.seePublicQuotes ? 'Hide public quotes' : 'Show public quotes')"
        color="neutral"
        size="xs"
        :icon="currentUser?.seePublicQuotes ? 'i-lucide-eye' : 'i-lucide-eye-off'"
        @click.stop="handleUpdateSeePublicQuotes"
      />
      <UTabs v-model="activeView" :items="viewItems" size="xs" variant="link" />
    </div>
    <section class="space-y-4 outline-1 outline-black/15 dark:outline-white/40 rounded-lg p-4 mb-2.5">
      <RouterView />
    </section>
  </main>
</template>
