<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface WatchlistEntry {
  id: number
  userId: number
  movieId: number
  movieTitle: string
  posterUrl: string
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
        <img
          v-if="entry.posterUrl"
          :src="entry.posterUrl"
          :alt="entry.movieTitle"
          class="poster"
        />

        <div>
          <h3>{{ entry.movieTitle || 'Movie ID: ' + entry.movieId }}</h3>
          <p>User ID: {{ entry.userId }}</p>
          <p>Added: {{ entry.addedDate }}</p>
        </div>
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
  display: flex;
  gap: 20px;
  align-items: center;
}

.poster {
  width: 90px;
  height: 135px;
  object-fit: cover;
  border-radius: 12px;
}

h3 {
  color: #facc15;
}
</style>
