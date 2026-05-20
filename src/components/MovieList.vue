<script lang="ts" setup>
interface Movie {
  id: number
  title: string
  description: string
  releaseDate: string
  imageUrl: string
}

defineProps({ movies: Array<Movie> })
</script>

<template>
  <div class="movie-grid">
    <div v-for="movie in movies" :key="movie.id" class="movie-card">
      <img :src="movie.imageUrl" :alt="movie.title" />
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.releaseDate }}</p>
      <p>{{ movie.description }}</p>
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

.movie-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
