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
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

onMounted(async () => {
  const response = await fetch(apiBaseUrl)
  movies.value = await response.json()
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
