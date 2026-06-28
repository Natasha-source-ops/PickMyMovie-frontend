import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import MovieList from '@/components/MovieList.vue'

const fakeMovies = [
  {
    id: 1,
    title: 'Inception',
    description: 'A mind-bending thriller.',
    releaseDate: '2010-07-16',
    imageUrl: '',
  },
  {
    id: 2,
    title: 'Devil wears prada',
    description: 'Funniest movie possible.',
    releaseDate: '2009-07-10',
    imageUrl: '',
  },
]
//TEST 2
describe('MovieList.vue', () => {
  it('renders the movie title', () => {
    const wrapper = shallowMount(MovieList, {
      props: { movies: fakeMovies },
    })
    const title = wrapper.find('h3')
    expect(title.text()).toContain('Inception')
  })
// TEST 4
  it('renders the correct number of movie cards', () => {
    const wrapper = shallowMount(MovieList, {
      props: { movies: fakeMovies },
    })
    const cards = wrapper.findAll('.movie-card')
    expect(cards).toHaveLength(2)
  })

  //TEST 5
  it("renders the movie description", () => {
    const wrapper = shallowMount (MovieList,
      {props:{movies:fakeMovies},
    })
    const description =wrapper.find('.description')
    expect(description.text()).toContain('A mind-bending thriller')
  })

  // TEST 6
  it("renders the movie Image", () => {
    const wrapper = shallowMount (MovieList,
      {props:{movies:fakeMovies},
    })
    console.log(wrapper.html())
    const image =wrapper.find('img')
    expect(image).toBeTruthy()
  })
})
