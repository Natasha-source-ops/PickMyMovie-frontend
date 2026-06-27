<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

interface Rating {
  id: number
  userId: number
  username: string
  movieId: number
  movieTitle: string
  posterUrl: string
  score: number
  comment: string
}

const ratings = ref<Rating[]>([])
const isLoading = ref(true)
const message = ref('')

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pickmymovie-backend-reem-natasha-4.onrender.com'

async function loadMyReviews() {
  const userId = localStorage.getItem('currentUserId')

  if (!userId) {
    message.value = 'Please log in to view your reviews.'
    isLoading.value = false
    return
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/ratings/user/${userId}`)

    if (!response.ok) {
      throw new Error('Reviews could not be loaded.')
    }

    ratings.value = await response.json()
  } catch (error) {
    message.value = 'Reviews could not be loaded.'
  } finally {
    isLoading.value = false
  }
}

async function deleteReview(id: number) {
  const response = await fetch(`${apiBaseUrl}/api/v1/ratings/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    message.value = 'Review could not be deleted.'
    return
  }

  ratings.value = ratings.value.filter((rating) => rating.id !== id)
}

onMounted(loadMyReviews)
</script>

<template>
  <main class="my-reviews-page">
    <RouterLink to="/" class="back-link">← Back</RouterLink>

    <h1>Your Reviews</h1>

    <p v-if="isLoading">Loading reviews...</p>
    <p v-else-if="message" class="message">{{ message }}</p>

    <p v-else-if="ratings.length === 0" class="message">
      You have not written any reviews yet.
    </p>

    <section v-else class="reviews-list">
      <article v-for="rating in ratings" :key="rating.id" class="review-card">
        <div class="review-movie-header">
          <img
            v-if="rating.posterUrl"
            :src="rating.posterUrl"
            :alt="rating.movieTitle"
            class="review-poster"
          />

          <div>
            <h2>{{ rating.movieTitle }}</h2>
            <p class="score">{{ rating.score }}/5 ⭐</p>
          </div>
        </div>
        <p>{{ rating.comment || 'No comment.' }}</p>

        <div class="actions">
          <RouterLink class="reviews-button" :to="`/reviews/${rating.movieId}`">
            Open Movie Reviews
          </RouterLink>

          <button class="delete-button" @click="deleteReview(rating.id)">
            Delete
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.my-reviews-page {
  min-height: 100vh;
  background: #050505;
  color: white;
  padding: 48px;
  font-family: Inter, sans-serif;
}

.back-link {
  color: #facc15;
  text-decoration: none;
  font-weight: 800;
}

h1 {
  font-size: 48px;
  margin: 32px 0;
}

.review-card {
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.25);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

h2,
.score,
.message {
  color: #facc15;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.reviews-button,
.delete-button {
  border-radius: 20px;
  padding: 10px 16px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
}

.reviews-button {
  background: #facc15;
  color: #1c1308;
  border: none;
}

.delete-button {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.review-movie-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
}

.review-poster {
  width: 70px;
  height: 105px;
  object-fit: cover;
  border-radius: 10px;
}
</style>
