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

async function toggleFavorite () {
  try {
    if (isFavorited.value) {
      await favoritesStore.unfavorite(props.post.user.id)
    } else {
      await favoritesStore.favorite(props.post.user.id)
    }
  } catch (err) {
    console.error('Failed to toggle favorite:', err)
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
        class="font-medium text-sm px-2 rounded-full transition-colors"
        :class="isFavorited ? 'bg-blue-600 text-white' : 'bg-blue-200'">
        {{ isFavorited ? 'Unfollow' : 'Follow' }}
      </button>
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