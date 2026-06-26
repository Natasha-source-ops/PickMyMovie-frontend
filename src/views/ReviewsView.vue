<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

interface Rating {
  id: number
  userId: number
  username: string
  movieId: number
  score: number
  comment: string
}

const route = useRoute()
const movieId = Number(route.params.movieId)

const ratings = ref<Rating[]>([])
const newScore = ref(0)
const newComment = ref('')
const message = ref('')
const isLoading = ref(true)

const currentUserId = localStorage.getItem('currentUserId')

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pickmymovie-backend-reem-natasha-4.onrender.com'

async function loadRatings() {
  isLoading.value = true

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/ratings/movie/${movieId}`)

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

async function submitReview() {
  message.value = ''

  if (!currentUserId) {
    message.value = 'Please log in to add a review.'
    return
  }

  if (newScore.value < 1 || newScore.value > 5) {
    message.value = 'Please select a rating between 1 and 5.'
    return
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: Number(currentUserId),
      movieId,
      score: newScore.value,
      comment: newComment.value,
    }),
  })

  if (!response.ok) {
    message.value = 'Review could not be saved.'
    return
  }

  newScore.value = 0
  newComment.value = ''
  await loadRatings()
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

onMounted(loadRatings)
</script>

<template>
  <main class="reviews-page">
    <RouterLink to="/" class="back-link">← Back to movies</RouterLink>

    <h1>Movie Reviews</h1>

    <section class="review-form">
      <h2>Add Review</h2>

      <p v-if="!currentUserId" class="message">
        Please log in to add a review.
      </p>

      <div v-else>
        <label for="score">Rating</label>
        <select id="score" v-model="newScore">
          <option :value="0" disabled>Select rating</option>
          <option :value="1">1 ⭐</option>
          <option :value="2">2 ⭐⭐</option>
          <option :value="3">3 ⭐⭐⭐</option>
          <option :value="4">4 ⭐⭐⭐⭐</option>
          <option :value="5">5 ⭐⭐⭐⭐⭐</option>
        </select>

        <label for="comment">Review</label>
        <textarea
          id="comment"
          v-model="newComment"
          placeholder="Write your review..."
        ></textarea>

        <button class="submit-button" @click="submitReview">
          Submit Review
        </button>
      </div>

      <p v-if="message" class="message">{{ message }}</p>
    </section>

    <section class="reviews-list">
      <h2>All Reviews</h2>

      <p v-if="isLoading">Loading reviews...</p>

      <p v-else-if="ratings.length === 0" class="message">
        No reviews yet.
      </p>

      <article v-for="rating in ratings" :key="rating.id" class="review-card">
        <div class="review-header">
          <strong>{{ rating.score }}/5 ⭐</strong>

          <button
            v-if="String(rating.userId) === currentUserId"
            class="delete-button"
            @click="deleteReview(rating.id)"
          >
            Delete
          </button>
        </div>

        <p>{{ rating.comment || 'No comment.' }}</p>
        <small>User ID: {{ rating.userId }}</small>
      </article>
    </section>
  </main>
</template>

<style scoped>
.reviews-page {
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

h2 {
  color: #facc15;
}

.review-form,
.review-card {
  background: #111827;
  border: 1px solid rgba(250, 204, 21, 0.25);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.review-form div {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

select,
textarea {
  background: #050505;
  color: white;
  border: 1px solid #facc15;
  border-radius: 12px;
  padding: 10px;
  font-family: inherit;
}

textarea {
  min-height: 100px;
}

.submit-button,
.delete-button {
  width: fit-content;
  border-radius: 20px;
  padding: 10px 16px;
  font-weight: 800;
  cursor: pointer;
}

.submit-button {
  border: none;
  background: #facc15;
  color: #1c1308;
}

.delete-button {
  border: 1px solid #ef4444;
  background: transparent;
  color: #ef4444;
}

.delete-button:hover {
  background: #ef4444;
  color: white;
}

.message {
  color: #facc15;
  font-weight: 800;
}

.review-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}
</style>
