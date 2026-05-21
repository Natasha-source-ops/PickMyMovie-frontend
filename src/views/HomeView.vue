<template>
  <div class="app">
    <h1>PickMyMovie</h1>
    <p>Find your next favorite film.</p>
    <MovieList :movies="movies" />
  </div>
</template>

<script lang="ts" setup>
import MovieList from '@/components/MovieList.vue'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const response = await fetch(`${apiBaseUrl}/movies`)
const movies = await response.json()
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
