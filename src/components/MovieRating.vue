<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ movieId: number }>()

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
    await fetch(`${apiBaseUrl}/api/v1/ratings/${id}`, {
      method: 'DELETE',
    })
    ratings.value = ratings.value.filter((entry) => entry.id !== id)
  } catch (error) {
    console.error('Failed to delete rating:', error)
  }
}
async function submitRating() {
  message.value = ''

  const userId = Number(localStorage.getItem('currentUserId'))

  const response = await fetch(`${apiBaseUrl}/api/v1/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
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
  <div class="ratings-section">
    <p v-if="isLoading">Loading ratings...</p>

    <p v-else-if="ratings.length === 0">No ratings yet.</p>

    <div v-else class="ratings-list">
      <div v-for="rating in ratings" :key="rating.id" class="rating-card">
        <div class="rating-header">
          <span class="score">{{ rating.score }}/5</span>
          <button
            v-if="rating.userId === currentUserId"
            class="remove-button"
            @click="deleteRating(rating.id)"
          >
            Remove
          </button>
        </div>
        <p class="comment">{{ rating.comment }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
