<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const postsStore = usePosts()
const favoritesStore = useFavorites()

await postsStore.fetchPosts()

// Lazy load favorites only for authenticated users
if (!user.isGuest) {
  try {
    await nextTick()
    await favoritesStore.fetchFavorites()
  } catch (err) {
    console.error('Failed to load favorites:', err)
  }
}
</script>

<template>
  <PostForm v-if="!user.isGuest" />
  <div class="grid gap-16">
    <PostItem v-for="post in postsStore.items" :key="post.id" v-bind="{ post }" />
  </div>
</template>
