<template>
  <div class="app">
    <h1>PickMyMovie</h1>
    <p>Find your next favorite film.</p>
    <MovieList :movies="movies" />
  </div>
</template>

<script lang="ts" setup>
import MovieList from '@/components/MovieList.vue'


const movies = [
  {
    id: 1,
    title: 'Neon Horizon',
    releaseDate: '2024-01-01',
    description: 'A sci-fi thriller set in the future.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'The Last Letter',
    releaseDate: '2023-05-12',
    description: 'A heartfelt drama about love and loss.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Midnight Heist',
    releaseDate: '2024-03-22',
    description: 'A high-stakes thriller about a dangerous robbery.',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
  },
]
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
