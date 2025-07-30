import { io, type Socket } from "socket.io-client"

class SocketService {
  private socket: Socket | null = null

  connect() {
    this.socket = io("http://localhost:4000") // Update with your server URL
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinEvent(eventId: string) {
    if (this.socket) {
      this.socket.emit("join-event", eventId)
    }
  }

  leaveEvent(eventId: string) {
    if (this.socket) {
      this.socket.emit("leave-event", eventId)
    }
  }

  onEventUpdate(callback: (event: any) => void) {
    if (this.socket) {
      this.socket.on("event-updated", callback)
    }
  }

  offEventUpdate() {
    if (this.socket) {
      this.socket.off("event-updated")
    }
  }
}

export const socketService = new SocketService()
