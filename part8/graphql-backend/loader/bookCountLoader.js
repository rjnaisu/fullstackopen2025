import DataLoader from 'dataloader'
import Book from '../models/book.js'
import mongoose from 'mongoose'

const createBookCountLoader = () =>
  new DataLoader(async (authorIds) => {
    const objectIds = authorIds.map((id) => new mongoose.Types.ObjectId(id))

    const counts = await Book.aggregate([
      {
        $match: {
          author: { $in: objectIds },
        },
      },
      {
        $group: {
          _id: '$author',
          bookCount: { $sum: 1 },
        },
      },
    ])

    const countByAuthor = new Map(counts.map((item) => [String(item._id), item.bookCount]))
    return authorIds.map((id) => countByAuthor.get(String(id)) ?? 0)
  })

export default createBookCountLoader
