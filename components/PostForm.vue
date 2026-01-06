<script setup>
import { usePosts } from '~/stores/posts'

const postsStore = usePosts()

const title = ref('')
const body = ref('')
const errors = ref({})

async function submit () {
  errors.value = {}

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
  } catch (err) {
    console.error('Failed to create post:', err)
  }
}
</script>

<template>
  <form
    class="grid gap-4 mb-16"
    @submit.prevent="submit">
    <div>
      <input
        v-model="title"
        placeholder="Post title"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"
        :class="{ 'border-red-500': errors.title }">
      <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
    </div>
    <div>
      <textarea
        v-model="body"
        placeholder="What is happening?!"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"
        :class="{ 'border-red-500': errors.body }"></textarea>
      <p v-if="errors.body" class="text-red-500 text-sm mt-1">{{ errors.body }}</p>
    </div>
    <button 
      class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50"
      :disabled="postsStore.loading">
      {{ postsStore.loading ? 'Posting...' : 'Post' }}
    </button>
  </form>
</template>