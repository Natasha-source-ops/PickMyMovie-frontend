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
const viewMode = ref<'grid' | 'list'>('grid')

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

    <div class="watchlist-header">
      <div>
        <p class="tagline">PickMyMovie</p>
        <h1>Your Watchlist</h1>
      </div>

      <div class="view-toggle" aria-label="Switch watchlist view">
        <button
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          Grid View
        </button>

        <button
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          List View
        </button>
      </div>
    </div>

    <p v-if="isLoading">Loading watchlist...</p>

    <div v-else-if="errorMessage" class="empty-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="watchlist.length === 0" class="empty-message">
      No movies in your watchlist yet.
    </div>

    <div
      v-else
      :class="viewMode === 'grid' ? 'watchlist-grid' : 'watchlist-list'"
    >
      <article
        v-for="entry in watchlist"
        :key="entry.id"
        class="watchlist-card"
        :class="{ compact: viewMode === 'list' }"
      >
        <img
          v-if="entry.posterUrl"
          :src="entry.posterUrl"
          :alt="entry.movieTitle"
          class="poster"
        />

        <div class="watchlist-content">
          <h2>{{ entry.movieTitle || 'Movie ID: ' + entry.movieId }}</h2>
          <p>User ID: {{ entry.userId }}</p>
          <p>Added: {{ entry.addedDate }}</p>

          <div class="action-row">
            <button
              class="remove-button"
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
      </article>
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

.watchlist-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-end;
  margin: 32px 0;
}

.tagline {
  color: #facc15;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 8px;
}

h1 {
  font-size: 48px;
  margin: 0;
}

.view-toggle {
  display: flex;
  gap: 10px;
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.25);
  border-radius: 24px;
  padding: 6px;
}

.view-toggle button {
  border: none;
  border-radius: 18px;
  background: transparent;
  color: #facc15;
  font-weight: 800;
  padding: 10px 16px;
  cursor: pointer;
}

.view-toggle button.active {
  background: #facc15;
  color: #1c1308;
}

.empty-message {
  color: #facc15;
  font-weight: 800;
}

.watchlist-grid {
  display: grid;
  gap: 20px;
}

.watchlist-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.watchlist-card {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr) 280px;
  gap: 20px;
  align-items: flex-start;
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 16px;
  padding: 20px;
}

.watchlist-card.compact {
  grid-template-columns: 60px minmax(0, 1fr) 220px;
  padding: 14px;
}

.poster {
  width: 90px;
  height: 135px;
  object-fit: cover;
  border-radius: 12px;
}

.watchlist-card.compact .poster {
  width: 60px;
  height: 90px;
}

.watchlist-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

h2 {
  color: #facc15;
  margin: 0 0 8px;
  font-size: 22px;
}

p {
  margin: 0 0 6px;
}

.action-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.remove-button {
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

.watchlist-card.compact .ratings-panel {
  max-width: 220px;
}

@media (max-width: 900px) {
  .watchlist-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .watchlist-card,
  .watchlist-card.compact {
    grid-template-columns: 1fr;
  }

  .ratings-panel {
    border-left: none;
    border-top: 1px solid rgba(250, 204, 21, 0.15);
    padding-left: 0;
    padding-top: 16px;
    max-width: none;
  }
}
</style>
