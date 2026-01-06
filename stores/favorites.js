export const useFavorites = defineStore('favorites', () => {
  const { $api } = useNuxtApp()

  const users = ref([])

  const posts = ref([])

  const loading = ref(false)

  const error = ref(null)

  async function fetchFavorites() {
    loading.value = true
    error.value = null

    try {
      const response = await $api.get('/favorites')
      users.value = response.data.users
      posts.value = response.data.posts
    } catch (err) {
      error.value = err.message || 'Failed to fetch favorites'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function favorite(userId) {
    error.value = null

    // Optimistic update
    if (!users.value.find(u => u.id === userId)) {
      users.value.push({ id: userId })
    }

    try {
      await $api.post(`/users/${userId}/favorite`)
    } catch (err) {
      // Revert on error
      users.value = users.value.filter(u => u.id !== userId)
      error.value = err.message || 'Failed to favorite user'
      throw err
    }
  }

  async function unfavorite(userId) {
    error.value = null

    // Optimistic update
    const originalUsers = users.value
    users.value = users.value.filter(u => u.id !== userId)

    try {
      await $api.delete(`/users/${userId}/favorite`)
    } catch (err) {
      // Revert on error
      users.value = originalUsers
      error.value = err.message || 'Failed to unfavorite user'
      throw err
    }
  }

  async function favoritePost(postId) {
    error.value = null

    // Optimistic update: add post ID to favorites
    if (!posts.value.find(p => p.id === postId)) {
      posts.value.push({ id: postId })
    }

    try {
      await $api.post(`/posts/${postId}/favorite`)
    } catch (err) {
      // Revert on error
      posts.value = posts.value.filter(p => p.id !== postId)
      error.value = err.message || 'Failed to favorite post'
      throw err
    }
  }

  async function unfavoritePost(postId) {
    error.value = null

    // Optimistic update
    const originalPosts = posts.value
    posts.value = posts.value.filter(p => p.id !== postId)

    try {
      await $api.delete(`/posts/${postId}/favorite`)
    } catch (err) {
      // Revert on error
      posts.value = originalPosts
      error.value = err.message || 'Failed to unfavorite post'
      throw err
    }
  }

  function isUserFavorited(userId) {
    return users.value.some(u => u.id === userId)
  }

  function isPostFavorited(postId) {
    return posts.value.some(p => p.id === postId)
  }

  function reset() {
    users.value = []
    posts.value = []
    error.value = null
  }

  return {
    users,
    posts,
    loading,
    error,
    fetchFavorites,
    favorite,
    unfavorite,
    favoritePost,
    unfavoritePost,
    isUserFavorited,
    isPostFavorited,
    reset
  }
})
