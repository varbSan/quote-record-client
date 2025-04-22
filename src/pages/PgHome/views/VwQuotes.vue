<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { GET_QUOTES_QUERY } from '@/api/apollo/queries/getQuotes.query'
import { useRoute, useRouter } from '@nuxt/ui/runtime/vue/stubs.js'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { computed, h, watch } from 'vue'
import type { GetQuotesQuery } from '@/gql/graphql'
import { Pen, Trash } from 'lucide-vue-next'
import dayjs from 'dayjs'

const { currentRoute } = useRouter()

const { load, result, loading, } = useLazyQuery(GET_QUOTES_QUERY, { searchTerm: currentRoute.value.query?.searchTerm?.toString() })
watch(() => currentRoute.value.query, () => {
  load(GET_QUOTES_QUERY, { searchTerm: currentRoute.value.query?.searchTerm?.toString()})
}, { immediate: true })

const data = computed(() => result.value?.getQuotes ?? [])

const columns: TableColumn<GetQuotesQuery['getQuotes'][number]>[] = [
  {
    accessorKey: 'quote',
    header: 'Quote',
    cell: ({ row }) => h('p', { class: 'text-pretty cursor-default', title: row.original.text }, row.original.text)
  },
  {

    accessorKey: 'updatedAt',
    header: 'Last edit',
    cell: ({ row }) => dayjs(row.original.updatedAt).format('DD-MM-YYYY'),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center justify-end gap-x-1' }, [
        h(Pen, { class: 'cursor-pointer', size: 14, title: 'edit', href: import.meta.env.BASE_URL }),
        h(Trash, { class: 'cursor-pointer', size: 14, title: 'delete' })
      ]) 
    }  
  },
]
</script>

<template>
  <UTable :data="data" :columns="columns" :loading="loading" class="flex-1" />
</template>
