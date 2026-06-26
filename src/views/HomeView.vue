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
