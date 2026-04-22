import { ApolloServer } from '@apollo/server'
import jwt from 'jsonwebtoken'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { expressMiddleware } from '@as-integrations/express5'

import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import User from './models/user.js'
import createBookCountLoader from './loader/bookCountLoader.js'

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer')) {
    return null
  }
  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id)
}

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)
        return { currentUser, bookCountLoader: createBookCountLoader() }
      },
    }),
  )

  httpServer.listen(port, () => console.log(`Server is now running on http://localhost:${port}`))
}

export default startServer
