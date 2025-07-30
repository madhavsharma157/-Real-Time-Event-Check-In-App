export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Event {
  id: string
  name: string
  description?: string
  location: string
  startTime: string
  endTime?: string
  imageUrl?: string
  attendees: User[]
  attendeeCount: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}
