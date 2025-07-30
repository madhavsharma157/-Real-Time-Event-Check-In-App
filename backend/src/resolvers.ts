import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { AuthContext } from "./types"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const resolvers = {
  Query: {
    events: async () => {
      return await prisma.event.findMany({
        include: {
          attendees: true,
        },
        orderBy: {
          startTime: "asc",
        },
      })
    },

    event: async (_: any, { id }: { id: string }) => {
      return await prisma.event.findUnique({
        where: { id },
        include: {
          attendees: true,
        },
      })
    },

    me: async (_: any, __: any, context: AuthContext) => {
      if (!context.user) {
        throw new Error("Not authenticated")
      }
      return context.user
    },
  },

  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { events: true },
      })

      if (!user) {
        throw new Error("Invalid credentials")
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error("Invalid credentials")
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET)

      return {
        token,
        user,
      }
    },

    register: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new Error("User already exists")
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        include: { events: true },
      })

      const token = jwt.sign({ userId: user.id }, JWT_SECRET)

      return {
        token,
        user,
      }
    },

    joinEvent: async (_: any, { eventId }: { eventId: string }, context: AuthContext) => {
      if (!context.user) {
        throw new Error("Not authenticated")
      }

      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          attendees: {
            connect: { id: context.user.id },
          },
        },
        include: {
          attendees: true,
        },
      })

      return event
    },

    leaveEvent: async (_: any, { eventId }: { eventId: string }, context: AuthContext) => {
      if (!context.user) {
        throw new Error("Not authenticated")
      }

      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          attendees: {
            disconnect: { id: context.user.id },
          },
        },
        include: {
          attendees: true,
        },
      })

      return event
    },
  },

  Event: {
    attendeeCount: (parent: any) => parent.attendees.length,
  },
}
