<script setup lang="ts">
import type { GetQuotesQuery } from '@/gql/graphql'
import type { TableColumn } from '@nuxt/ui'
import { DELETE_QUOTE_MUTATION } from '@/api/apollo/mutations/deleteQuote.mutation'
import { UPDATE_QUOTE_MUTATION } from '@/api/apollo/mutations/updateQuote.mutation'
import { GET_QUOTES_QUERY } from '@/api/apollo/queries/getQuotes.query'
import Button from '@nuxt/ui/runtime/components/Button.vue'
import Textarea from '@nuxt/ui/runtime/components/Textarea.vue'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useRouter } from '@nuxt/ui/runtime/vue/stubs.js'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { Pencil, Trash } from 'lucide-vue-next'
import { computed, h, ref, watch } from 'vue'

const { currentRoute } = useRouter()
const toast = useToast()

const { load, result, loading } = useLazyQuery(GET_QUOTES_QUERY, { searchTerm: currentRoute.value.query?.searchTerm?.toString() })
watch(() => currentRoute.value.query, () => {
  load(GET_QUOTES_QUERY, { searchTerm: currentRoute.value.query?.searchTerm?.toString() })
}, { immediate: true })

const {
  mutate: updateQuote,
  loading: updateQuoteLoading,
  error: updateQuoteError,
} = useMutation(UPDATE_QUOTE_MUTATION)

const {
  mutate: deleteQuote,
} = useMutation(DELETE_QUOTE_MUTATION)

const editQuoteTextState = ref('')
const data = computed(() => result.value?.getQuotes ?? [])

const activeEditQuote = ref<number>()
const isActiveQuote = (id: number) => activeEditQuote.value === id

function resetEdit() {
  editQuoteTextState.value = ''
  activeEditQuote.value = undefined
}

function editQuote(id: number, text: string) {
  editQuoteTextState.value = text
  return activeEditQuote.value === id ? activeEditQuote.value = undefined : activeEditQuote.value = id
}

async function handleUpdateQuote(id: number) {
  try {
    await updateQuote({ updateQuoteInput: { id, text: editQuoteTextState.value } })
    resetEdit()
    toast.add({ title: 'Success', description: 'Quote updated successfully!', color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: updateQuoteError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}

async function handleDeleteQuote(id: number) {
  try {
    await deleteQuote({ deleteQuoteInput: { id } }, { update: cache => cache.evict({ fieldName: 'getQuotes' }) })
    toast.add({ title: 'Success', description: 'Quote deleted successfully!', color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: updateQuoteError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}

const columns: TableColumn<GetQuotesQuery['getQuotes'][number]>[] = [
  {
    accessorKey: 'quote',
    header: 'Quote',
    cell: ({ row }) => {
      return [
        h(
          'p',
          { class: ['text-wrap cursor-default', { hidden: isActiveQuote(row.original.id) }], title: row.original.text, onClick: () => editQuote(row.original.id, row.original.text) },
          row.original.text,
        ),
        h('div', { class: 'flex flex-col' }, [
          h(
            Textarea,
            {
              'modelValue': editQuoteTextState.value,
              'onUpdate:modelValue': (val: string | number) => {
                editQuoteTextState.value = val.toString()
              },
              'class': ['mb-1', { hidden: !isActiveQuote(row.original.id) }],
            },
          ),
          h(
            Button,
            {
              size: 'xs',
              loading: updateQuoteLoading.value && isActiveQuote(row.original.id),
              class: ['self-end', { hidden: !isActiveQuote(row.original.id) }],
              onClick: async () => await handleUpdateQuote(row.original.id),
            },
            {
              default: () => 'Update',
            },
          ),
        ]),
      ]
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center justify-end gap-x-1' }, [
        h(Pencil, { class: 'cursor-pointer', size: 14, title: 'edit', onClick: () => editQuote(row.original.id, row.original.text) }),
        h(Trash, { class: 'cursor-pointer', size: 14, title: 'delete', onClick: () => handleDeleteQuote(row.original.id) }),
      ])
    },
  },
]
</script>

<template>
  <UTable :data="data" :columns="columns" :loading="loading" class="flex-1" />
</template>
