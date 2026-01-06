export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const items = ref([])

  const loading = ref(false)

  const error = ref(null)

  async function fetchPosts () {
    loading.value = true
    error.value = null

    try {
      const response = await $api.get('/posts')
      items.value = response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch posts'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPost ({ title, body }) {
    error.value = null

    try {
      const response = await $api.post('/posts', { title, body })
      items.value.unshift(response.data)
      return response
    } catch (err) {
      error.value = err.message || 'Failed to create post'
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    fetchPosts,
    createPost
  }
})
