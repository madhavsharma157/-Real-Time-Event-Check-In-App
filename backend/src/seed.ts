import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const hashedPassword = await bcrypt.hash("password123", 10)

  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
  })

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      name: "Tech Meetup 2024",
      description: "Join us for an exciting tech meetup with industry leaders",
      location: "San Francisco, CA",
      startTime: new Date("2024-02-15T18:00:00Z"),
      endTime: new Date("2024-02-15T21:00:00Z"),
      imageUrl: "/placeholder.svg?height=200&width=300",
      attendees: {
        connect: [{ id: user1.id }],
      },
    },
  })

  const event2 = await prisma.event.create({
    data: {
      name: "College Fest 2024",
      description: "Annual college festival with music, food, and fun activities",
      location: "University Campus",
      startTime: new Date("2024-02-20T10:00:00Z"),
      endTime: new Date("2024-02-20T22:00:00Z"),
      imageUrl: "/placeholder.svg?height=200&width=300",
      attendees: {
        connect: [{ id: user2.id }],
      },
    },
  })

  const event3 = await prisma.event.create({
    data: {
      name: "Open Mic Night",
      description: "Showcase your talent at our monthly open mic event",
      location: "Downtown Coffee House",
      startTime: new Date("2024-02-25T19:00:00Z"),
      endTime: new Date("2024-02-25T23:00:00Z"),
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
