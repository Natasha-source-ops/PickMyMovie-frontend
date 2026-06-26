import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MovieRating from '@/components/MovieRating.vue'

const fakeRatings = [
  { id: 1, userId: 42, movieId: 1, score: 4, comment: 'Really loved it!' },
  { id: 2, userId: 99, movieId: 1, score: 5, comment: 'Masterpiece.' },
]


it('should render the items from the backend', async () => {
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => fakeRatings,
  } as Response)
  const wrapper = mount(MovieRating, {
    props: { movieId: 1, showForm: false }
  })
  await flushPromises()
  expect(wrapper.text()).toContain('Really loved it!')
})
