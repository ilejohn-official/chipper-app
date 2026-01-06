export const useFavorites = defineStore('favorites', () => {
  const { $api } = useNuxtApp()

  const users = ref([])

  const posts = ref([])

  const loading = ref(false)

  const error = ref(null)

  async function fetchFavorites () {
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

  async function favorite (userId) {
    error.value = null

    try {
      await $api.post(`/users/${userId}/favorite`)
      if (!users.value.find(u => u.id === userId)) {
        users.value.push({ id: userId })
      }
    } catch (err) {
      error.value = err.message || 'Failed to favorite user'
      throw err
    }
  }

  async function unfavorite (userId) {
    error.value = null

    try {
      await $api.delete(`/users/${userId}/favorite`)
      users.value = users.value.filter(u => u.id !== userId)
    } catch (err) {
      error.value = err.message || 'Failed to unfavorite user'
      throw err
    }
  }

  function isFavorited (userId) {
    return users.value.some(u => u.id === userId)
  }

  function reset () {
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
    isFavorited,
    reset
  }
})
