import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieList from '@/components/MovieList.vue'



const fakeMovies = [
  {
    id: 1,
    title: 'Inception',
    description: 'A mind-bending thriller.',
    releaseDate: '2010-07-16',
    imageUrl: ''
  }

]

describe('MovieList.vue', () => {
  it('renders the movie title', () => {
    const wrapper = mount(MovieList, {
      props: { movies: fakeMovies },
    })
    const title = wrapper.find('h3')
    expect(title.text()).toContain('Inception')
  })
})
