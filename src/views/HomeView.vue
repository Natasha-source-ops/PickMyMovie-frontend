<template>
  <main class="app">
    <nav class="navbar">
      <RouterLink to="/" class="nav-logo">PickMyMovie</RouterLink>

      <div class="nav-links">
        <a href="#movies">Movies</a>
        <RouterLink to="/watchlist">Watchlist</RouterLink>
      </div>

      <div class="nav-actions">
        <span v-if="currentUser" class="nav-user">
          {{ currentUser.username }}
        </span>

        <RouterLink v-if="!currentUser" to="/login" class="nav-button">
          Log in
        </RouterLink>

        <button v-else class="nav-button" @click="logout">
          Log out
        </button>
      </div>
    </nav>

    <section class="hero-section">
      <div class="hero-text">
        <p class="tagline">PickMyMovie</p>
        <h1>Find your next movie to watch.</h1>

        <p class="description">
          Discover movie recommendations based on genres and streaming platforms.
          Save movies to your watchlist and rate them later.
        </p>

        <button class="primary-button" @click="scrollToMovies">
          Discover movies
        </button>
      </div>
    </section>

    <section id="movies" class="movies-section">
      <div class="section-header">
        <div>
          <p class="section-tagline">Recommendations</p>
          <h2>Movie Recommendations</h2>
        </div>
      </div>

      <div class="filter-panel" aria-label="Movie search and filters">
        <div class="filter-field search-field">
          <label for="movie-search">Search</label>
          <input
            id="movie-search"
            v-model="searchQuery"
            type="text"
            placeholder="Search movies..."
            @keyup.enter="loadMovies"
          />
        </div>

        <div class="filter-field">
          <label for="genre">Genre</label>
          <select id="genre" v-model="selectedGenre" @change="loadMovies">
            <option value="">All Genres</option>
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="16">Animation</option>
            <option value="35">Comedy</option>
            <option value="80">Crime</option>
            <option value="18">Drama</option>
            <option value="14">Fantasy</option>
            <option value="27">Horror</option>
            <option value="10749">Romance</option>
            <option value="878">Sci-Fi</option>
            <option value="53">Thriller</option>
          </select>
        </div>

        <div class="filter-field">
          <label for="provider">Platform</label>
          <select id="provider" v-model="selectedProvider" @change="loadMovies">
            <option value="">All Platforms</option>
            <option value="8">Netflix</option>
            <option value="119">Prime Video</option>
            <option value="337">Disney+</option>
            <option value="350">Apple TV+</option>
            <option value="531">Paramount+</option>
          </select>
        </div>

        <div class="filter-field">
          <label for="region">Region</label>
          <select id="region" v-model="selectedRegion" @change="loadMovies">
            <option
              v-for="region in regions"
              :key="region.iso31661"
              :value="region.iso31661"
            >
              {{ region.englishName }}
            </option>
          </select>
        </div>

        <button class="filter-button" @click="loadMovies">
          Search
        </button>
      </div>

      <p v-if="isLoading">Loading movies...</p>
      <p v-else-if="errorMessage" class="error-message" role="alert">
        {{ errorMessage }}
      </p>
      <MovieList v-else :movies="movies" />
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import MovieList from '@/components/MovieList.vue'

interface Region {
  iso31661: string
  englishName: string
  nativeName: string
}

const movies = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const selectedGenre = ref('')
const selectedProvider = ref('')
const selectedRegion = ref('DE')
const regions = ref<Region[]>([])
const searchQuery = ref('')
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

async function loadMovies() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const params = new URLSearchParams()

    if (selectedGenre.value) {
      params.append('genre', selectedGenre.value)
    }

    if (selectedProvider.value) {
      params.append('provider', selectedProvider.value)
      params.append('region', selectedRegion.value)
    }

    if (searchQuery.value.trim()) {
      params.append('query', searchQuery.value.trim())
    }

    const queryString = params.toString()
    const requestUrl = queryString
      ? `${apiBaseUrl}/api/v1/movies?${queryString}`
      : `${apiBaseUrl}/api/v1/movies`

    const response = await fetch(requestUrl)

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
}

async function loadRegions() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/regions`)

    if (!response.ok) {
      throw new Error('Regions could not be loaded.')
    }

    const data = await response.json()

    regions.value = data.sort((a: Region, b: Region) =>
      a.englishName.localeCompare(b.englishName)
    )
  } catch (error) {
    regions.value = [
      { iso31661: 'DE', englishName: 'Germany', nativeName: 'Germany' },
      { iso31661: 'US', englishName: 'United States', nativeName: 'United States' },
      { iso31661: 'GB', englishName: 'United Kingdom', nativeName: 'United Kingdom' },
    ]
  }
}

onMounted(async () => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser') || 'null')
  await loadRegions()
  await loadMovies()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #050505;
  color: white;
  font-family: Inter, sans-serif;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 48px;
  background: rgba(5, 5, 5, 0.92);
  border-bottom: 1px solid rgba(250, 204, 21, 0.18);
  backdrop-filter: blur(12px);
}

.nav-logo {
  color: #facc15;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
}

.nav-links,
.nav-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-links a,
.nav-links :deep(a) {
  color: #d1d5db;
  text-decoration: none;
  font-weight: 700;
}

.nav-links a:hover,
.nav-links :deep(a:hover) {
  color: #facc15;
}

.nav-user {
  color: #facc15;
  font-weight: 800;
}

.nav-button {
  border: 1px solid #facc15;
  border-radius: 20px;
  background: transparent;
  color: #facc15;
  padding: 9px 16px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.nav-button:hover {
  background: #facc15;
  color: #1c1308;
}

.hero-section {
  min-height: 78vh;
  padding: 48px;
  display: flex;
  align-items: center;
  max-width: 1150px;
  margin: 0 auto;
}

.hero-text {
  max-width: 720px;
}

.tagline,
.section-tagline {
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

.primary-button {
  margin-top: 32px;
  border-radius: 24px;
  padding: 14px 26px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  border: none;
  background: #facc15;
  color: #1c1308;
  transition: transform 0.2s ease, background 0.2s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
  background: #e0a93b;
}

.movies-section {
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 20px;
}

.movies-section h2 {
  font-size: 34px;
  margin: 4px 0 0;
  color: #f8f1e7;
}

.filter-panel {
  margin-bottom: 28px;
  padding: 18px;
  display: flex;
  gap: 14px;
  align-items: flex-end;
  flex-wrap: wrap;
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.22);
  border-radius: 18px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-field {
  flex: 1;
  min-width: 240px;
}

.filter-field label {
  color: #facc15;
  font-weight: 800;
}

.filter-field input,
.filter-field select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #facc15;
  background: #050505;
  color: white;
  min-width: 190px;
}

.search-field input {
  width: 100%;
}

.filter-button {
  border: none;
  border-radius: 22px;
  padding: 11px 22px;
  font-weight: 800;
  cursor: pointer;
  background: #facc15;
  color: #1c1308;
}

.filter-button:hover {
  background: #e0a93b;
  transform: translateY(-2px);
}

.error-message {
  color: #facc15;
}

@media (max-width: 800px) {
  .navbar {
    padding: 16px 24px;
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-links,
  .nav-actions {
    flex-wrap: wrap;
  }

  .hero-section {
    min-height: 65vh;
    padding: 24px;
  }

  h1 {
    font-size: 42px;
  }

  .movies-section {
    padding: 24px;
  }

  .filter-panel {
    align-items: stretch;
  }

  .filter-field,
  .filter-field input,
  .filter-field select,
  .filter-button {
    width: 100%;
  }
}
</style>
