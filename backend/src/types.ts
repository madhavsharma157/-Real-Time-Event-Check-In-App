export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  events: Event[]
}

export interface Event {
  id: string
  name: string
  description?: string
  location: string
  startTime: Date
  endTime?: Date
  imageUrl?: string
  attendees: User[]
}

export interface AuthContext {
  user?: User
  token?: string
}

export interface SocketData {
  userId: string
  eventId?: string
}
