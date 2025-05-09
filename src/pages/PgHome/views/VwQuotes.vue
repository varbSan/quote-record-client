<script setup lang="ts">
import type { GetQuotesQuery } from '@/gql/graphql'
import type { TableColumn } from '@nuxt/ui'
import { DELETE_QUOTE_MUTATION } from '@/api/apollo/mutations/deleteQuote.mutation'
import { GENERATE_QUOTE_IMAGE_MUTATION } from '@/api/apollo/mutations/generateQuoteImage.mutation'
import { UPDATE_QUOTE_MUTATION } from '@/api/apollo/mutations/updateQuote.mutation'
import { GET_QUOTES_QUERY } from '@/api/apollo/queries/getQuotes.query'
import { useCurrentUser } from '@/composables/useCurrentUser'
import Button from '@nuxt/ui/runtime/components/Button.vue'
import Checkbox from '@nuxt/ui/runtime/components/Checkbox.vue'
import Skeleton from '@nuxt/ui/runtime/components/Skeleton.vue'
import Textarea from '@nuxt/ui/runtime/components/Textarea.vue'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useRouter } from '@nuxt/ui/runtime/vue/stubs.js'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { onClickOutside } from '@vueuse/core'
import { ImagePlus, LoaderCircle, Pencil, Trash } from 'lucide-vue-next'
import * as v from 'valibot'
import { computed, h, reactive, ref, useTemplateRef, watch } from 'vue'

const { currentUser } = useCurrentUser()
const { currentRoute, push } = useRouter()
const toast = useToast()

const userQuoteCount = computed(() => currentUser.value?.quoteCount ?? 0)
const limit = ref(50)

const { result, loading, refetch } = useQuery(GET_QUOTES_QUERY, {
  searchTerm: currentRoute.value.query?.searchTerm?.toString(),
  limit: limit.value,
})

watch(currentUser, () => {
  refetch({
    searchTerm: currentRoute.value.query?.searchTerm?.toString(),
    limit: limit.value,
  })
})
const {
  mutate: updateQuote,
  loading: updateQuoteLoading,
  error: updateQuoteError,
} = useMutation(UPDATE_QUOTE_MUTATION)

const {
  mutate: generateQuoteImage,
  loading: generateQuoteImageLoading,
  error: generateQuoteImageError,
} = useMutation(GENERATE_QUOTE_IMAGE_MUTATION)

const {
  mutate: deleteQuote,
  loading: deleteQuoteLoading,
} = useMutation(DELETE_QUOTE_MUTATION)

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
})

const schema = v.object({
  text: v.pipe(
    v.string('Please enter a quote'),
    v.minLength(2, 'Please enter a quote that is minimum than 2 characters'),
  ),
  isPublic: v.boolean(),
})

type UpdateQuoteSchema = v.InferOutput<typeof schema>

const stateUpdateQuote = reactive<UpdateQuoteSchema>({
  text: '',
  isPublic: false,
})

const mutatingQuoteId = ref<number>()
const data = computed(() => result.value?.getQuotes ?? [])

const activeEditQuoteId = ref<number>()
const isActiveQuote = (id: number) => activeEditQuoteId.value === id

const tableRef = useTemplateRef<HTMLTableElement>('table')
onClickOutside(tableRef, () => activeEditQuoteId.value = undefined)

function isQuoteOwner(quoteUserId: number) {
  return quoteUserId === currentUser.value?.id
}

const loadedImageQuoteId = reactive<Record<string, boolean>>({})

function resetEdit() {
  stateUpdateQuote.text = ''
  stateUpdateQuote.isPublic = false
  activeEditQuoteId.value = undefined
}

function editQuote(id: number, text: string, isPublic: boolean) {
  if (activeEditQuoteId.value === id) {
    resetEdit()
    return
  }
  activeEditQuoteId.value = id
  stateUpdateQuote.text = text
  stateUpdateQuote.isPublic = isPublic
}

function isGenerateQuoteImageLoading(id: number) {
  return id === mutatingQuoteId.value && generateQuoteImageLoading.value
}

function isDeleteQuoteLoading(id: number) {
  return id === mutatingQuoteId.value && deleteQuoteLoading.value
}

async function handleUpdateQuote(id: number) {
  const updateQuoteInput = { id, ...stateUpdateQuote }
  try {
    await updateQuote({ updateQuoteInput })
    resetEdit()
    toast.add({ title: 'Success', description: 'Quote updated successfully!', color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: updateQuoteError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}

async function handleDeleteQuote(quoteId: number) {
  try {
    mutatingQuoteId.value = quoteId
    await deleteQuote({ deleteQuoteInput: { id: quoteId } })
    toast.add({ title: 'Success', description: 'Quote deleted successfully!', color: 'success' })
  }
  catch (err) {
    console.error(err, updateQuoteError.value?.message)
    toast.add({ title: 'Error', description: 'Something went wrong. Please try again later.', color: 'error' })
  }
  mutatingQuoteId.value = undefined
}

async function handleGenerateQuoteImage(quoteId: number) {
  try {
    mutatingQuoteId.value = quoteId
    await generateQuoteImage({ quoteId })
    toast.add({ title: 'Success', description: 'Image generated successfully!', color: 'success' })
  }
  catch (err) {
    console.error(err, generateQuoteImageError.value?.message)
    toast.add({ title: 'Error', description: 'Something went wrong. Please try again later.', color: 'error' })
  }
  mutatingQuoteId.value = undefined
}

async function changePageIndex(pagination: number) {
  if (limit.value <= userQuoteCount.value) {
    limit.value += 50
  }
  else {
    limit.value = userQuoteCount.value
  }

  const tablePageIndex = pagination - 1
  tableRef.value?.tableApi?.setPageIndex(tablePageIndex)

  refetch({
    searchTerm: currentRoute.value.query?.searchTerm?.toString(),
    limit: limit.value,
  })
}

const columns: TableColumn<GetQuotesQuery['getQuotes'][number]>[] = [
  {
    accessorKey: 'quote',
    header: 'Quote',
    cell: ({ row }) => {
      return [
        h(
          'p',
          {
            class: ['text-wrap cursor-pointer hover:text-highlighted', { hidden: isActiveQuote(row.original.id) }],
            onClick: () => push({ name: 'quote', params: { quoteId: row.original.id } }),
          },
          row.original.text,
        ),
        h('div', { class: 'flex flex-col' }, [
          h(
            Textarea,
            {
              'modelValue': stateUpdateQuote.text,
              'onUpdate:modelValue': (val: string | number) => {
                stateUpdateQuote.text = val.toString()
              },
              'class': ['mb-1', { hidden: !isActiveQuote(row.original.id) }],
            },
          ),
          h(
            'p',
            {
              class: ['flex justify-end cursor-pointer hover:text-highlighted mb-1', { hidden: !isActiveQuote(row.original.id) }],
            },
            [
              h(
                'span',
                {
                  class: 'text-xs cursor-pointer hover:text-highlighted',
                  onClick: () => stateUpdateQuote.isPublic = !stateUpdateQuote.isPublic,
                },
                'Make quote public',
              ),
              h(
                Checkbox,
                {
                  'modelValue': stateUpdateQuote.isPublic,
                  'onUpdate:modelValue': (val: boolean) => {
                    stateUpdateQuote.isPublic = val
                  },
                  'size': 'xs',
                  'class': 'ml-1 cursor-pointer',
                  'onClick': () => stateUpdateQuote.isPublic = !stateUpdateQuote.isPublic,
                },
              ),
            ],
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
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      return h('div', { class: 'size-12' }, [
        h(
          'img',
          {
            src: row.original.imageUrl,
            class: [
              'cursor-pointer size-full hover:scale-300 z-50 rounded outline-[0.5px] transition',
              { hidden: !loadedImageQuoteId[row.original.id] },
            ],
            onClick: () => push({ name: 'quote', params: { quoteId: row.original.id } }),
            onLoad: () => loadedImageQuoteId[row.original.id] = true,
          },
        ),
        h(
          Skeleton,
          {
            class: ['size-full', { hidden: loadedImageQuoteId[row.original.id] }],
          },
        ),
      ])
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => [
      h('div', { class: ['flex items-center justify-end gap-x-1', { hidden: !isQuoteOwner(row.original.user.id) }] }, [
        h(Pencil, {
          class: 'cursor-pointer hover:text-highlighted',
          size: 14,
          title: 'edit',
          onClick: () => editQuote(row.original.id, row.original.text, row.original.isPublic),
        }),
        h(ImagePlus, {
          class: ['cursor-pointer hover:text-highlighted', { hidden: isGenerateQuoteImageLoading(row.original.id) }],
          size: 14,
          title: 'generate',
          onClick: () => handleGenerateQuoteImage(row.original.id),
        }),
        h(LoaderCircle, {
          class: ['cursor-default animate-spin', { hidden: !isGenerateQuoteImageLoading(row.original.id) }],
          size: 14,
        }),
        h(Trash, {
          class: ['cursor-pointer hover:text-highlighted', { hidden: isDeleteQuoteLoading(row.original.id) }],
          size: 14,
          title: 'delete',
          onClick: () => handleDeleteQuote(row.original.id),
        }),
        h(LoaderCircle, {
          class: ['cursor-default animate-spin', { hidden: !isDeleteQuoteLoading(row.original.id) }],
          size: 14,
        }),
      ]),
      h('div', { class: ['flex items-center justify-end gap-x-1', { hidden: isQuoteOwner(row.original.user.id) }] }, [
        h(Pencil, {
          class: 'cursor-default text-default/20',
          size: 14,
          title: 'edit',
        }),
        h(ImagePlus, {
          class: 'cursor-default text-default/20',
          size: 14,
          title: 'generate',
        }),
        h(Trash, {
          class: 'cursor-default text-default/20',
          size: 14,
          title: 'delete',
        }),
      ]),
    ],
  },

]
</script>

<template>
  <UTable
    ref="table"
    v-model:pagination="pagination"
    :data="data"
    :columns="columns"
    :loading="loading"
    class="flex-1"
    :pagination-options="{
      getPaginationRowModel: getPaginationRowModel(),
    }"
  />
  <div class="flex justify-center border-t border-default pt-2">
    <UPagination
      size="xs"
      :loading="loading"
      :default-page="(tableRef?.tableApi?.getState().pagination.pageIndex || 0) + 1"
      :items-per-page="tableRef?.tableApi?.getState().pagination.pageSize"
      :total="tableRef?.tableApi?.getFilteredRowModel().rows.length"
      @update:page="changePageIndex"
    />
  </div>
</template>
