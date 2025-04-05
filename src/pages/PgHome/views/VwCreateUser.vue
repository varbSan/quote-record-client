<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation } from '@vue/apollo-composable'
import * as v from 'valibot'
import { reactive } from 'vue'
import { CREATE_USER_MUTATION } from '../../../api/apollo/mutations/createUser.mutation'

const {
  mutate: createUser,
  loading: createUserLoading,
  error: createUserError,
} = useMutation(CREATE_USER_MUTATION)

const toast = useToast()

const schema = v.object({
  email: v.pipe(v.string(), v.email(), v.maxLength(250, 'Please enter an email that is less than 250 characters')),
  firstName: v.pipe(v.string(), v.maxLength(250, 'Please enter a first name that is less than 250 characters')),
  lastName: v.pipe(v.string(), v.maxLength(250, 'Please enter a last name that is less than 250 characters')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Schema>({
  email: '',
  firstName: '',
  lastName: '',
})

async function onSubmitUser(event: FormSubmitEvent<Schema>) {
  try {
    const res = await createUser({ createUserInput: event.data })
    toast.add({ title: 'Success', description: `${res?.data?.createUser.firstName}'s profile created successfully!`, color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: createUserError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col" @submit="onSubmitUser">
    <UFormField label="Email" name="fmail">
      <UInput v-model="state.email" type="email" />
    </UFormField>

    <UFormField label="First name" name="firstName">
      <UInput v-model="state.firstName" type="text" />
    </UFormField>

    <UFormField label="Last name" name="lastName">
      <UInput v-model="state.lastName" type="text" />
    </UFormField>

    <div class="flex justify-end mt-auto">
      <UButton type="submit" :loading="createUserLoading" class="self-end">
        Create user
      </UButton>
    </div>
  </UForm>
</template>
