import 'dotenv/config'
import connectToDatabase from './db.js'
import seedDatabase from './seedDatabase.js'
import startServer from './server.js'

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

const main = async () => {
  await connectToDatabase(MONGODB_URI)
  await seedDatabase()
  await startServer(PORT)
}

main()
