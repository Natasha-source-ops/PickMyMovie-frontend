<template>
  <main class="app">
    <section class="hero-section">
      <div class="hero-text">
        <p class="tagline">PickMyMovie</p>

        <h1>Find your next movie to watch.</h1>

        <p class="description">
          Discover movie recommendations based on genres and streaming platforms.
          Save movies to your watchlist and rate them later.
        </p>

        <p v-if="currentUser" class="user-info">
          Logged in as {{ currentUser.username }}
        </p>

        <div class="button-row">
          <button class="primary-button" @click="scrollToMovies">
            Discover movies
          </button>

          <RouterLink v-if="!currentUser" to="/login" class="secondary-button">
            Log in
          </RouterLink>

          <button v-else class="secondary-button" @click="logout">
            Log out
          </button>

          <RouterLink to="/watchlist" class="secondary-button">
            Watchlist
          </RouterLink>
        </div>
      </div>
    </section>

    <section id="movies" class="movies-section">
      <h2>Movie Recommendations</h2>

      <p v-if="isLoading">Loading movies...</p>
      <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <MovieList v-else :movies="movies" />
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import MovieList from '@/components/MovieList.vue'

const movies = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const currentUser = ref(JSON.parse(localStorage.getItem('currentUser') || 'null'))

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pickmymovie-backend-reem-natasha-4.onrender.com'

function scrollToMovies() {
  document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
}

function logout() {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('currentUserId')
  currentUser.value = null
}

onMounted(async () => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser') || 'null')

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/movies`)

    if (!response.ok) {
      throw new Error('Movies could not be loaded.')
    }

    const data = await response.json()

    movies.value = data.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      releaseDate: movie.release_date,
      imageUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '',
    }))
  } catch (error) {
    errorMessage.value = 'Movies could not be loaded. Please try again later.'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #050505;
  color: white;
  font-family: Inter, sans-serif;
}

.hero-section {
  min-height: 85vh;
  padding: 48px;
  display: flex;
  align-items: center;
  max-width: 1150px;
  margin: 0 auto;
}

.hero-text {
  max-width: 720px;
}

.tagline {
  color: #facc15;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  font-size: 64px;
  line-height: 1.05;
  margin: 16px 0;
}

.description {
  color: #d1d5db;
  font-size: 19px;
  max-width: 620px;
  line-height: 1.6;
}

.button-row {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.primary-button,
.secondary-button {
  border-radius: 24px;
  padding: 14px 26px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.primary-button {
  border: none;
  background: #facc15;
  color: #1c1308;
}

.secondary-button {
  background: transparent;
  color: #facc15;
  border: 1px solid #facc15;
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
}

.secondary-button:hover {
  background: #facc15;
  color: #1c1308;
}

.movies-section {
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.movies-section h2 {
  font-size: 34px;
  margin-bottom: 24px;
  color: #f8f1e7;
}

.error-message {
  color: #facc15;
}

@media (max-width: 800px) {
  .hero-section {
    padding: 24px;
  }

  h1 {
    font-size: 42px;
  }

  .button-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

.user-info {
  color: #facc15;
  font-weight: 800;
  margin-top: 20px;
}
</style>
