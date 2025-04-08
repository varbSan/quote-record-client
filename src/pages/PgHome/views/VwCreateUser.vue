<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { CREATE_USER_MUTATION } from '@/api/apollo/mutations/createUser.mutation'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation } from '@vue/apollo-composable'
import * as v from 'valibot'
import { reactive } from 'vue'

const {
  mutate: createUser,
  loading: createUserLoading,
  error: createUserError,
} = useMutation(CREATE_USER_MUTATION)

const toast = useToast()

const schema = v.object({
  email: v.pipe(v.string(), v.email('Please provide a valid email adress'), v.maxLength(250, 'Please enter an email that is less than 250 characters')),
  username: v.pipe(v.string(), v.maxLength(250, 'Please enter a username that is less than 250 characters')),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Schema>({
  email: '',
  username: '',
})

async function onSubmitUser(event: FormSubmitEvent<Schema>) {
  try {
    const res = await createUser({ createUserInput: event.data })
    toast.add({ title: 'Success', description: `${res?.data?.createUser.username}'s profile created successfully!`, color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: createUserError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col" @submit="onSubmitUser">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" type="email" />
    </UFormField>

    <UFormField label="Username" name="username">
      <UInput v-model="state.username" type="text" />
    </UFormField>
    <div class="flex flex-col justify-end mt-auto">
      <p class="text-xs">
        By selecting
        <span class="font-bold">Create user</span> you agree to our
        <ULink class="" :to="{ name: 'userAgreement' }">
          User agreement
        </ULink> and acknowledge reading our
        <ULink :to="{ name: 'userPrivacyNotice' }">
          User Privacy Notice
        </ULink>
        .
      </p>
      <UButton type="submit" :loading="createUserLoading" class="self-end">
        Create user
      </UButton>
    </div>
  </UForm>
</template>
