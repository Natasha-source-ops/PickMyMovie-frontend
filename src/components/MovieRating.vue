<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ movieId: number; showForm?: boolean }>()

interface Rating {
  id: number
  userId: number
  movieId: number
  score: number
  comment: string
}

const ratings = ref<Rating[]>([])
const newScore = ref(0)
const newComment = ref('')
const isLoading = ref(false)
const message = ref('')
const currentUserId = Number(localStorage.getItem('currentUserId'))
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'https://pickmymovie-backend-reem-natasha-4.onrender.com'

async function loadRatings() {
  isLoading.value = true
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/ratings/movie/${props.movieId}`)
    ratings.value = await response.json()
  } catch (error) {
    console.error('Failed to load ratings:', error)
  } finally {
    isLoading.value = false
  }
}

async function deleteRating(id: number) {
  try {
    await fetch(`${apiBaseUrl}/api/v1/ratings/${id}`, { method: 'DELETE' })
    ratings.value = ratings.value.filter((r) => r.id !== id)
  } catch (error) {
    console.error('Failed to delete rating:', error)
  }
}

async function submitRating() {
  message.value = ''
  const userId = Number(localStorage.getItem('currentUserId'))
  const response = await fetch(`${apiBaseUrl}/api/v1/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      movieId: props.movieId,
      score: newScore.value,
      comment: newComment.value,
    }),
  })
  if (!response.ok) {
    message.value = 'Failed to submit rating.'
    return
  }
  await loadRatings()
  newScore.value = 0
  newComment.value = ''
}

onMounted(loadRatings)
</script>

<template>
  <div class="rating-wrapper">

    <div v-if="isLoading" class="no-ratings">Loading ratings...</div>
    <div v-else-if="ratings.length === 0" class="no-ratings">No ratings yet.</div>
    <div v-else class="ratings-list">
      <p class="panel-title">Community ratings</p>
      <p class="avg-score">
        ⭐ {{ (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1) }}
        <span class="review-count">({{ ratings.length }} reviews)</span>
      </p>
      <div v-for="rating in ratings" :key="rating.id" class="rating-card">
        <div class="rating-header">
          <span class="stars">{{ '⭐'.repeat(rating.score) }}</span>
          <button
            v-if="rating.userId === currentUserId"
            class="delete-button"
            @click="deleteRating(rating.id)"
          >Delete</button>
        </div>
        <p class="comment">{{ rating.comment }}</p>
      </div>
    </div>

    <div v-if="showForm" class="submit-form">
      <p class="form-label">Rate this movie</p>
      <div class="star-row">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ active: star <= newScore }"
          @click="newScore = star"
        >★</span>
      </div>
      <textarea
        v-model="newComment"
        class="comment-input"
        placeholder="Write your review (optional)..."
      ></textarea>
      <button class="submit-button" :disabled="newScore === 0" @click="submitRating">
        Submit Rating
      </button>
      <p v-if="message" class="message">{{ message }}</p>
    </div>

  </div>
</template>

<style scoped>
.rating-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-ratings {
  color: #6b7280;
  font-size: 13px;
}

.panel-title {
  color: #9ca3af;
  font-size: 12px;
  margin: 0;
}

.avg-score {
  color: #facc15;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.review-count {
  color: #6b7280;
  font-size: 12px;
  font-weight: 400;
}

.ratings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-card {
  border-top: 1px solid rgba(250, 204, 21, 0.1);
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stars {
  font-size: 12px;
}

.comment {
  color: #d1d5db;
  font-size: 12px;
  margin: 0;
}

.delete-button {
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
}

.delete-button:hover {
  background: #ef4444;
  color: white;
}

.submit-form {
  border-top: 1px solid rgba(250, 204, 21, 0.15);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  color: #9ca3af;
  font-size: 13px;
  margin: 0;
}

.star-row {
  display: flex;
  gap: 6px;
}

.star {
  font-size: 28px;
  color: #4b5563;
  cursor: pointer;
  transition: color 0.15s;
}

.star.active { color: #facc15; }
.star:hover { color: #facc15; }

.comment-input {
  background: #1f2937;
  color: white;
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  width: 100%;
  box-sizing: border-box;
}

.comment-input::placeholder { color: #6b7280; }

.submit-button {
  background: #facc15;
  color: #1c1308;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: 800;
  cursor: pointer;
  width: fit-content;
}

.submit-button:disabled { opacity: 0.4; cursor: not-allowed; }
.submit-button:hover:not(:disabled) { background: #e0a93b; }

.message {
  color: #ef4444;
  font-size: 13px;
  margin: 0;
}
</style>
