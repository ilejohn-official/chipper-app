<script setup>
const postsStore = usePosts()

const isLoading = ref(false)

async function loadNewPosts () {
  isLoading.value = true
  try {
    if (postsStore.pending.length > 0) {
      postsStore.items.unshift(...postsStore.pending)
      postsStore.pending = []
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <transition name="slide-down">
    <div
      v-if="postsStore.pending.length > 0"
      class="mb-6 flex justify-center animate-in fade-in slide-in-from-top-2 duration-300">
      <button
        @click="loadNewPosts"
        :disabled="isLoading"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg">
        <span v-if="isLoading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </span>
        <span v-else>
          Load {{ postsStore.pending.length }} New {{ postsStore.pending.length === 1 ? 'Post' : 'Posts' }}
        </span>
      </button>
    </div>
  </transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
