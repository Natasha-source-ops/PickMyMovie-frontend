<script lang="ts" setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

interface Movie {
  id: number
  title: string
  description: string
  releaseDate: string
  imageUrl: string
}

const props = defineProps<{
  movies: Movie[]
}>()

const selectedMovieId = ref<number | null>(null)
const averageRatings = ref<Record<number, number>>({})

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pickmymovie-backend-reem-natasha-4.onrender.com'

function toggleMovie(movieId: number) {
  selectedMovieId.value = selectedMovieId.value === movieId ? null : movieId
}

async function addToWatchlist(movie: Movie) {
  const userId = localStorage.getItem('currentUserId')

  if (!userId) {
    alert('Please log in first.')
    return
  }

  const response = await fetch(`${apiBaseUrl}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: Number(userId),
      movieId: movie.id,
      movieTitle: movie.title,
      posterUrl: movie.imageUrl
    })
  })

  if (!response.ok) {
    alert('Could not add movie to watchlist.')
    return
  }

  alert(`${movie.title} added to watchlist`)
}

async function loadAverageRatings() {
  averageRatings.value = {}

  const movieIds = props.movies.map((movie) => movie.id)

  if (movieIds.length === 0) {
    return
  }

  const response = await fetch(
    `${apiBaseUrl}/api/v1/ratings/averages?movieIds=${movieIds.join(',')}`
  )

  if (!response.ok) {
    return
  }

  averageRatings.value = await response.json()
}

watch(
  () => props.movies,
  () => {
    loadAverageRatings()
  },
  { immediate: true }
)
</script>

<template>
  <div class="movie-grid">
    <div
      v-for="movie in movies"
      :key="movie.id"
      class="movie-card"
      :class="{ selected: selectedMovieId === movie.id }"
      @click="toggleMovie(movie.id)"
    >
      <img :src="movie.imageUrl" :alt="movie.title" />

      <div class="movie-content">
        <h3>{{ movie.title }}</h3>
        <p class="release-date">{{ movie.releaseDate }}</p>

        <p class="average-rating">
          Average Rating:
          <span v-if="averageRatings[movie.id] !== undefined && averageRatings[movie.id] > 0">
            {{ (averageRatings[movie.id] ?? 0).toFixed(1) }}/5 ⭐
          </span>
          <span v-else>No ratings yet</span>
        </p>

        <p class="description">{{ movie.description }}</p>

        <div class="movie-actions">
          <button class="watchlist-button" @click.stop="addToWatchlist(movie)">
            Add to Watchlist
          </button>

          <RouterLink
            class="reviews-button"
            :to="`/reviews/${movie.id}`"
            @click.stop
          >
            Reviews
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.movie-card {
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.15);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
  border-color: rgba(250, 204, 21, 0.45);
}

.movie-card.selected {
  transform: scale(1.06);
  box-shadow: 0 20px 45px rgba(250, 204, 21, 0.22);
  border-color: #facc15;
  z-index: 2;
}

.movie-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease;
}

.movie-card.selected img {
  transform: scale(1.04);
}

.movie-content {
  padding: 16px;
}

h3 {
  color: #f8f1e7;
  margin: 0 0 8px;
}

.release-date {
  color: #facc15;
  margin: 0 0 10px;
}

.average-rating {
  color: #facc15;
  font-weight: 800;
  margin: 0 0 10px;
}

.description {
  color: #d1d5db;
  margin: 0;
  line-height: 1.5;
}

.movie-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.watchlist-button,
.reviews-button {
  border-radius: 20px;
  font-weight: 800;
  padding: 10px 16px;
  cursor: pointer;
  text-decoration: none;
}

.watchlist-button {
  border: none;
  background: #facc15;
  color: #1c1308;
}

.reviews-button {
  border: 1px solid #facc15;
  background: transparent;
  color: #facc15;
}

.watchlist-button:hover {
  background: #e0a93b;
}

.reviews-button:hover {
  background: #facc15;
  color: #1c1308;
}
</style>
