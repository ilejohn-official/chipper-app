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

const isUserFavorited = computed(() => favoritesStore.isUserFavorited(props.post.user.id))
const isPostFavorited = computed(() => favoritesStore.isPostFavorited(props.post.id))
const isOwnPost = computed(() => user.data.id === props.post.user.id)
const isFollowLoading = ref(false)
const isPostFavLoading = ref(false)
const followError = ref(null)
const postFavError = ref(null)

async function toggleUserFavorite () {
  if (isFollowLoading.value) return

  isFollowLoading.value = true
  followError.value = null

  try {
    if (isUserFavorited.value) {
      await favoritesStore.unfavorite(props.post.user.id)
    } else {
      await favoritesStore.favorite(props.post.user.id)
    }
  } catch (err) {
    followError.value = err.message || 'Failed to update favorite'
    console.error('Failed to toggle user favorite:', err)
  } finally {
    isFollowLoading.value = false
  }
}

async function togglePostFavorite () {
  if (isPostFavLoading.value) return

  isPostFavLoading.value = true
  postFavError.value = null

  try {
    if (isPostFavorited.value) {
      await favoritesStore.unfavoritePost(props.post.id)
    } else {
      await favoritesStore.favoritePost(props.post.id)
    }
  } catch (err) {
    postFavError.value = err.message || 'Failed to update favorite'
    console.error('Failed to toggle post favorite:', err)
  } finally {
    isPostFavLoading.value = false
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
        @click="toggleUserFavorite"
        class="font-medium text-sm px-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :class="isUserFavorited ? 'bg-blue-600 text-white' : 'bg-blue-200'"
        :disabled="isFollowLoading">
        <span v-if="isFollowLoading" class="flex items-center justify-center gap-1">
          <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Following...</span>
        </span>
        <span v-else>
          {{ isUserFavorited ? 'Unfollow' : 'Follow' }}
        </span>
      </button>
    </div>
    <div v-if="followError" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
      {{ followError }}
    </div>
    <p>
      {{ post.body }}
    </p>
    <button 
      v-if="!user.isGuest"
      @click="togglePostFavorite"
      class="flex items-center justify-center gap-2 p-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      :class="isPostFavorited 
        ? 'bg-red-500 text-white' 
        : 'bg-red-200 text-red-500'"
      :disabled="isPostFavLoading">
      <span v-if="isPostFavLoading" class="flex items-center justify-center gap-2 font-bold">
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Saving...</span>
      </span>
      <span v-else class="flex items-center justify-center gap-2 font-bold">
        <HeartIcon
          :class="isPostFavorited ? 'fill-current h-6 w-6' : 'h-6 w-6 stroke-current'"
          class="stroke-current" />
        <span>
          {{ isPostFavorited ? 'Remove from favorites' : 'Add to my favorites' }}
        </span>
      </span>
    </button>
    <div v-if="postFavError" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
      {{ postFavError }}
    </div>
  </div>
</template>