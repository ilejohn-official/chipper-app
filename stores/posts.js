export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const items = ref([])

  const pending = ref([])

  const loading = ref(false)

  const error = ref(null)

  const newestPostId = ref(null)

  async function fetchPosts() {
    loading.value = true
    error.value = null

    try {
      const response = await $api.get('/posts')
      items.value = response.data

      // Track the newest post ID for polling
      if (response.data.length > 0) {
        newestPostId.value = response.data[0].id
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch posts'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchNewPosts() {
    error.value = null

    try {
      // Fetch all posts
      const response = await $api.get('/posts')

      if (response.data && response.data.length > 0) {
        // Client-side filtering: find posts newer than newestPostId
        const newPosts = response.data.filter(post =>
          post.id > newestPostId.value
        )

        if (newPosts.length > 0) {
          // Store new posts in pending list
          pending.value = newPosts

          // Update newest post ID
          newestPostId.value = response.data[0].id
        }
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch new posts'
      throw err
    }
  }

  async function createPost({ title, body, image }) {
    error.value = null

    try {
      let payload

      // If image is provided, use FormData for multipart upload
      if (image) {
        payload = new FormData()
        payload.append('title', title)
        payload.append('body', body)
        payload.append('image', image)
      } else {
        // Otherwise send as JSON
        payload = { title, body }
      }

      const response = await $api.post('/posts', payload)
      items.value.unshift(response.data)

      // Update newest post ID
      newestPostId.value = response.data.id

      return response
    } catch (err) {
      error.value = err.message || 'Failed to create post'
      throw err
    }
  }

  return {
    items,
    pending,
    loading,
    error,
    fetchPosts,
    fetchNewPosts,
    createPost
  }
})
