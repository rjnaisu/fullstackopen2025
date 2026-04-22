import { ALL_BOOKS, ALL_GENRES } from '../queries'

export const updateBookCache = (cache, bookToAdd) => {
  const genresToAdd = [null, ...bookToAdd.genres]

  genresToAdd.forEach((genre) => {
    cache.updateQuery({ query: ALL_BOOKS, variables: { genre } }, (data) => {
      if (!data) {
        return data
      }

      if (data.allBooks.some((book) => book.id === bookToAdd.id)) {
        return data
      }

      return {
        ...data,
        allBooks: data.allBooks.concat(bookToAdd),
      }
    })
  })

  cache.updateQuery({ query: ALL_GENRES }, (data) => {
    if (!data) {
      return data
    }
    return {
      ...data,
      allGenres: [...new Set(data.allGenres.concat(bookToAdd.genres))],
    }
  })
}
