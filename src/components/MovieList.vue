<script lang="ts" setup>
import { ref } from 'vue'

interface Movie {
  id: number
  title: string
  description: string
  releaseDate: string
  imageUrl: string
}

defineProps<{
  movies: Movie[]
}>()

const selectedMovieId = ref<number | null>(null)

function toggleMovie(movieId: number) {
  selectedMovieId.value = selectedMovieId.value === movieId ? null : movieId
}
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
        <p class="description">{{ movie.description }}</p>
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

.description {
  color: #d1d5db;
  margin: 0;
  line-height: 1.5;
}
</style>
