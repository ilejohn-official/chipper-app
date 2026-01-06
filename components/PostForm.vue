<script setup>
import { usePosts } from '~/stores/posts'

const postsStore = usePosts()

const title = ref('')
const body = ref('')
const errors = ref({})
const formError = ref('')

function clearTitleError () {
  if (title.value.trim()) {
    delete errors.value.title
  }
}

function clearBodyError () {
  if (body.value.trim()) {
    delete errors.value.body
  }
}

async function submit () {
  errors.value = {}
  formError.value = ''

  if (!title.value.trim()) {
    errors.value.title = 'Title is required'
  }
  if (!body.value.trim()) {
    errors.value.body = 'Post content is required'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  try {
    await postsStore.createPost({
      title: title.value,
      body: body.value
    })
    title.value = ''
    body.value = ''
    formError.value = ''
  } catch (err) {
    formError.value = postsStore.error || 'Failed to create post. Please try again.'
    console.error('Failed to create post:', err)
  }
}
</script>

<template>
  <form
    class="grid gap-4 mb-16"
    @submit.prevent="submit">
    <div v-if="formError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      {{ formError }}
    </div>
    <div>
      <input
        v-model="title"
        @input="clearTitleError"
        placeholder="Post title"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base disabled:bg-gray-100"
        :class="{ 'border-red-500': errors.title }"
        :disabled="postsStore.loading">
      <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
    </div>
    <div>
      <textarea
        v-model="body"
        @input="clearBodyError"
        placeholder="What is happening?!"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base disabled:bg-gray-100"
        :class="{ 'border-red-500': errors.body }"
        :disabled="postsStore.loading"></textarea>
      <p v-if="errors.body" class="text-red-500 text-sm mt-1">{{ errors.body }}</p>
    </div>
    <button 
      class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      :disabled="postsStore.loading">
      <span v-if="postsStore.loading" class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Posting...
      </span>
      <span v-else>Post</span>
    </button>
  </form>
</template>