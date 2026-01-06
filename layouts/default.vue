<script setup>
const user = useUser()
const favoritesStore = useFavorites()

watch(
  () => user.isGuest,
  async (isGuest) => {
    if (!isGuest) {
      try {
        await favoritesStore.fetchFavorites()
      } catch (err) {
        console.error('Failed to load favorites:', err)
      }
    }
  }
)

async function logout () {
  await user.logout()
  window.location.reload()
}
</script>

<template>
  <div class="p-4 max-w-sm mx-auto">
    <header class="flex items-center justify-between mb-8">
      <NuxtLink
        to="/"
        class="text-3xl font-bold underline">
        Chipper
      </NuxtLink>
      <div
        v-if="user.isGuest"
        class="flex items-center gap-2">
        <NuxtLink
          to="/login"
          class="text-blue-600">
          Login
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="text-blue-600">
          Register
        </NuxtLink>
      </div>
      <div
        v-else
        class="flex items-center gap-2">
        <div>
          Hello, {{ user.data.name }}!
        </div>
        <a
          href="#"
          class="text-blue-600"
          @click="logout">
          Logout
        </a>
      </div>
    </header>
    <slot />
  </div>
</template>