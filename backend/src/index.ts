import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import cors from "cors"
import { typeDefs } from "./schema"
import { resolvers } from "./resolvers"
import type { AuthContext } from "./types"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-event", (eventId: string) => {
    socket.join(`event-${eventId}`)
    console.log(`User ${socket.id} joined event ${eventId}`)
  })

  socket.on("leave-event", (eventId: string) => {
    socket.leave(`event-${eventId}`)
    console.log(`User ${socket.id} left event ${eventId}`)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

async function startServer() {
  await server.start()

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<AuthContext> => {
        const token = req.headers.authorization?.replace("Bearer ", "")

        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
            const user = await prisma.user.findUnique({
              where: { id: decoded.userId },
              include: { events: true },
            })
            return { user: user || undefined, token }
          } catch (error) {
            return {}
          }
        }

        return {}
      },
    }),
  )

  const PORT = process.env.PORT || 4000
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    console.log(`🔌 Socket.io server ready at http://localhost:${PORT}`)
  })
}

startServer().catch((error) => {
  console.error("Error starting server:", error)
})

// Export io for use in resolvers
export { io }
