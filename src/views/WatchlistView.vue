<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import MovieRating from '@/components/MovieRating.vue'

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
const errorMessage = ref('')
const openRatingId = ref<number | null>(null)

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'https://pickmymovie-backend-reem-natasha-4.onrender.com'

async function loadWatchlist() {
  const userId = localStorage.getItem('currentUserId')

  if (!userId) {
    errorMessage.value = 'Please log in to view your watchlist.'
    isLoading.value = false
    return
  }

  try {
    const response = await fetch(`${apiBaseUrl}/watchlist/${userId}`)

    if (!response.ok) {
      throw new Error('Watchlist could not be loaded.')
    }

    watchlist.value = await response.json()
  } catch (error) {
    errorMessage.value = 'Watchlist could not be loaded. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

async function removeFromWatchlist(id: number) {
  const response = await fetch(`${apiBaseUrl}/watchlist/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    alert('Could not remove movie from watchlist.')
    return
  }

  watchlist.value = watchlist.value.filter((entry) => entry.id !== id)
}
function toggleRating(movieId: number) {
  openRatingId.value = openRatingId.value === movieId ? null : movieId
}

onMounted(loadWatchlist)
</script>

<template>
  <main class="watchlist-page">
    <RouterLink to="/" class="back-link">← Back</RouterLink>

    <h1>Your Watchlist</h1>

    <p v-if="isLoading">Loading watchlist...</p>

    <div v-else-if="errorMessage" class="empty-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="watchlist.length === 0" class="empty-message">
      No movies in your watchlist yet.
    </div>

    <div v-else class="watchlist-grid">
      <div v-for="entry in watchlist" :key="entry.id" class="watchlist-card">
        <img v-if="entry.posterUrl" :src="entry.posterUrl" :alt="entry.movieTitle" class="poster" />

        <div class="watchlist-content">
          <h3>{{ entry.movieTitle || 'Movie ID: ' + entry.movieId }}</h3>
          <p>User ID: {{ entry.userId }}</p>
          <p>Added: {{ entry.addedDate }}</p>

          <div style="display: flex; gap: 10px; margin-top: 10px">
            <button
              class="remove-button"
              style="margin-top: 0"
              @click="removeFromWatchlist(entry.id)"
            >
              Remove
            </button>
            <button class="rate-button" @click="toggleRating(entry.movieId)">
              {{ openRatingId === entry.movieId ? 'Close' : '⭐ Rate' }}
            </button>
          </div>

          <MovieRating
            v-if="openRatingId === entry.movieId"
            :movie-id="entry.movieId"
            :show-form="true"
          />
        </div>

        <div class="ratings-panel">
          <MovieRating :movie-id="entry.movieId" :show-form="false" />
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

.empty-message {
  color: #facc15;
  font-weight: 800;
}

.watchlist-grid {
  display: grid;
  gap: 20px;
}

.watchlist-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 16px;
  padding: 20px;
}

.poster {
  width: 90px;
  height: 135px;
  object-fit: cover;
  border-radius: 12px;
}

.watchlist-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

h3 {
  color: #facc15;
  margin: 0 0 8px;
}

p {
  margin: 0 0 6px;
}

.remove-button {
  margin-top: 10px;
  width: fit-content;
  border: 1px solid #facc15;
  border-radius: 20px;
  background: transparent;
  color: #facc15;
  font-weight: 800;
  padding: 10px 16px;
  cursor: pointer;
}

.remove-button:hover {
  background: #facc15;
  color: #1c1308;
}

.rate-button {
  border: 1px solid #facc15;
  border-radius: 20px;
  background: #facc15;
  color: #1c1308;
  font-weight: 800;
  padding: 10px 16px;
  cursor: pointer;
}

.rate-button:hover {
  background: #e0a93b;
  border-color: #e0a93b;
}
  .ratings-panel {
    border-left: 1px solid rgba(250, 204, 21, 0.15);
    padding-left: 20px;
    min-width: 220px;
    max-width: 280px;
  }

</style>
