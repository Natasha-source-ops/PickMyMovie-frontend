<template>
  <div class="app">
    <h1>PickMyMovie</h1>
    <p>Find your next favorite film.</p>
    <MovieList :movies="movies" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import MovieList from '@/components/MovieList.vue'

const movies = ref([])

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string

onMounted(async () => {
  const response = await fetch(apiBaseUrl)
  const data = await response.json()

  movies.value = data.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    description: movie.overview,
    releaseDate: movie.release_date,
    imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  }))
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #050914;
  color: white;
  font-family: 'Inter', sans-serif;
  padding: 40px;
}

h1 {
  font-size: 48px;
  margin-bottom: 8px;
}
</style>
