<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface WatchlistEntry {
  id: number
  userId: number
  movieId: number
  addedDate: string
}

const watchlist = ref<WatchlistEntry[]>([])
const isLoading = ref(true)

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pickmymovie-backend-reem-natasha-4.onrender.com'

onMounted(async () => {
  const response = await fetch(`${apiBaseUrl}/watchlist/1`)
  watchlist.value = await response.json()
  isLoading.value = false
})
</script>

<template>
  <main class="watchlist-page">
    <RouterLink to="/" class="back-link">← Back</RouterLink>

    <h1>Your Watchlist</h1>

    <p v-if="isLoading">Loading watchlist...</p>

    <div v-else-if="watchlist.length === 0">
      No movies in your watchlist yet.
    </div>

    <div v-else class="watchlist-grid">
      <div v-for="entry in watchlist" :key="entry.id" class="watchlist-card">
        <h3>Movie ID: {{ entry.movieId }}</h3>
        <p>User ID: {{ entry.userId }}</p>
        <p>Added: {{ entry.addedDate }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.watchlist-page {
  min-height: 100vh;
  background: #050505;
  color: white;
  padding: 48px;
  font-family: Inter, sans-serif;
}

.back-link {
  color: #facc15;
  text-decoration: none;
  font-weight: 800;
}

h1 {
  font-size: 48px;
  margin: 32px 0;
}

.watchlist-grid {
  display: grid;
  gap: 20px;
}

.watchlist-card {
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 16px;
  padding: 20px;
}

h3 {
  color: #facc15;
}
</style>
