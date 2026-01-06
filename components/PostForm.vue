<script setup>
import { usePosts } from '~/stores/posts'

const postsStore = usePosts()

const title = ref('')
const body = ref('')
const selectedFile = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)
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

function handleFileSelect (event) {
  const file = event.target.files?.[0]
  if (file) {
    selectedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}

function clearImage () {
  selectedFile.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
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
      body: body.value,
      image: selectedFile.value
    })
    title.value = ''
    body.value = ''
    clearImage()
    formError.value = ''
  } catch (err) {
    formError.value = postsStore.error || 'Failed to create post. Please try again.'
    console.error('Failed to create post:', err)
  }
}
</script>

<template>
  <form class="grid gap-4 mb-16" @submit.prevent="submit">
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
    
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <label class="flex flex-col items-center justify-center cursor-pointer">
        <div class="text-center">
          <svg class="mx-auto h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <p class="mt-2 text-sm text-gray-600">
            <span class="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileSelect"
          :disabled="postsStore.loading">
      </label>
      
      <div v-if="imagePreview" class="mt-4 relative">
        <img
          :src="imagePreview"
          alt="Preview"
          class="max-h-48 rounded-lg mx-auto">
        <button
          type="button"
          @click="clearImage"
          class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          :disabled="postsStore.loading">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <button
      class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      :disabled="postsStore.loading">
      <span v-if="postsStore.loading" class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Posting...
      </span>
      <span v-else>Post</span>
    </button>
  </form>
</template>