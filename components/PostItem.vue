<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'

const favoritesStore = useFavorites()
const user = useUser()

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const isFavorited = computed(() => favoritesStore.isFavorited(props.post.user.id))
const isOwnPost = computed(() => user.data.id === props.post.user.id)
const isLoading = ref(false)
const error = ref(null)

async function toggleFavorite () {
  if (isLoading.value) return

  isLoading.value = true
  error.value = null

  try {
    if (isFavorited.value) {
      await favoritesStore.unfavorite(props.post.user.id)
    } else {
      await favoritesStore.favorite(props.post.user.id)
    }
  } catch (err) {
    error.value = err.message || 'Failed to update favorite'
    console.error('Failed to toggle favorite:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        by <strong>{{ post.user.name }}</strong>
      </div>
      <button 
        v-if="!user.isGuest && !isOwnPost"
        @click="toggleFavorite"
        class="font-medium text-sm px-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :class="isFavorited ? 'bg-blue-600 text-white' : 'bg-blue-200'"
        :disabled="isLoading">
        <span v-if="isLoading" class="flex items-center justify-center gap-1">
          <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isFavorited ? 'Following...' : 'Following...' }}</span>
        </span>
        <span v-else>
          {{ isFavorited ? 'Unfollow' : 'Follow' }}
        </span>
      </button>
    </div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
      {{ error }}
    </div>
    <p>
      {{ post.body }}
    </p>
    <button class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg">
      <HeartIcon
        class="h-6 stroke-current" />
      <span class="font-bold">
        Add to my favorites
      </span>
    </button>
  </div>
</template>