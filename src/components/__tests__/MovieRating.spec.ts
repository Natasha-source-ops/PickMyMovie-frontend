import { describe, it, expect, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import MovieRating from '@/components/MovieRating.vue'
import MovieList from '@/components/MovieList.vue'

const fakeRatings = [
  { id: 1, userId: 42, movieId: 1, score: 4, comment: 'Really loved it!' },
  { id: 2, userId: 99, movieId: 1, score: 5, comment: 'Masterpiece.' },
]

//tEST 1

describe('MovieRating.vue', () => {
  it('should render the items from the backend', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => fakeRatings,
    } as Response)
    const wrapper = shallowMount(MovieRating, {
      props: { movieId: 1, showForm: false },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Really loved it!')
  })
  //TEST2

  it('should render message when no ratings received', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response)

    const wrapper = shallowMount(MovieRating, {
      props: { movieId: 1, showForm: false },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('No ratings yet.')
  })

  //TEST3
  it("shows the rating form when showForm is true'", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response)

    const wrapper = shallowMount(MovieRating, {
      props: { movieId: 1, showForm: true },
    })
    const form = wrapper.find('.submit-form')

    await flushPromises()
    expect(form).toBeTruthy()
  })

  // TEST4
  it("hides the rating form when showForm is false'", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response)

    const wrapper = shallowMount(MovieRating, {
      props: { movieId: 1, showForm: false },
    })
    const form = wrapper.find('.submit-form')

    await flushPromises()
    expect(form.exists()).toBe(false)
  })



})
