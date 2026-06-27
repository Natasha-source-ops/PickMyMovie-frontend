<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

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
const viewMode = ref<'grid' | 'list'>('grid')

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pickmymovie-backend-reem-natasha-4.onrender.com'

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

    <section v-else-if="viewMode === 'grid'" class="watchlist-grid">
      <article
        v-for="entry in watchlist"
        :key="entry.id"
        class="grid-card"
      >
        <img
          v-if="entry.posterUrl"
          :src="entry.posterUrl"
          :alt="entry.movieTitle"
          class="grid-poster"
        />

        <div class="grid-content">
          <h2>{{ entry.movieTitle || 'Movie ID: ' + entry.movieId }}</h2>
          <p class="added-date">Added: {{ entry.addedDate }}</p>

          <div class="grid-actions">
            <RouterLink
              class="reviews-button"
              :to="`/reviews/${entry.movieId}`"
            >
              Reviews
            </RouterLink>

            <button
              class="remove-button"
              @click="removeFromWatchlist(entry.id)"
            >
              Remove
            </button>
          </div>
        </div>
      </article>
    </section>

    <section v-else class="watchlist-list">
      <article
        v-for="entry in watchlist"
        :key="entry.id"
        class="list-card"
      >
        <img
          v-if="entry.posterUrl"
          :src="entry.posterUrl"
          :alt="entry.movieTitle"
          class="list-poster"
        />

        <div class="list-content">
          <h2>{{ entry.movieTitle || 'Movie ID: ' + entry.movieId }}</h2>
          <p>User ID: {{ entry.userId }}</p>
          <p>Added: {{ entry.addedDate }}</p>
        </div>

        <div class="list-actions">
          <RouterLink
            class="reviews-button"
            :to="`/reviews/${entry.movieId}`"
          >
            Reviews
          </RouterLink>

          <button
            class="remove-button"
            @click="removeFromWatchlist(entry.id)"
          >
            Remove
          </button>
        </div>
      </article>
    </section>
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.grid-card {
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.grid-card:hover {
  transform: translateY(-4px);
  border-color: #facc15;
}

.grid-poster {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
}

.grid-content {
  padding: 16px;
}

.grid-content h2 {
  color: #facc15;
  font-size: 20px;
  margin: 0 0 8px;
}

.added-date {
  color: #d1d5db;
  margin: 0 0 14px;
}

.grid-actions,
.list-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.watchlist-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.list-card {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 16px;
  padding: 20px;
}

.list-poster {
  width: 90px;
  height: 135px;
  object-fit: cover;
  border-radius: 12px;
}

.list-content h2 {
  color: #facc15;
  margin: 0 0 8px;
  font-size: 24px;
}

.list-content p {
  margin: 0 0 6px;
}

.remove-button,
.reviews-button {
  border-radius: 20px;
  font-weight: 800;
  padding: 10px 16px;
  cursor: pointer;
  text-decoration: none;
}

.remove-button {
  border: 1px solid #facc15;
  background: transparent;
  color: #facc15;
}

.reviews-button {
  border: none;
  background: #facc15;
  color: #1c1308;
}

.remove-button:hover {
  background: #facc15;
  color: #1c1308;
}

.reviews-button:hover {
  background: #e0a93b;
}

@media (max-width: 900px) {
  .watchlist-page {
    padding: 24px;
  }

  .watchlist-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .list-card {
    grid-template-columns: 1fr;
  }

  .list-actions {
    justify-content: flex-start;
  }
}
</style>
