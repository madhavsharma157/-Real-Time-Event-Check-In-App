"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from "react-native"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apolloClient } from "../lib/apollo"
import { GET_EVENT } from "../graphql/queries"
import { JOIN_EVENT_MUTATION, LEAVE_EVENT_MUTATION } from "../graphql/mutations"
import { socketService } from "../lib/socket"
import { useAuthStore } from "../store/authStore"
import type { Event, User } from "../types"

interface Props {
  route: any
  navigation: any
}

export default function EventDetailScreen({ route, navigation }: Props) {
  const { eventId } = route.params
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [realTimeAttendees, setRealTimeAttendees] = useState<User[]>([])

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_EVENT,
        variables: { id: eventId },
        fetchPolicy: "network-only",
      })
      return data.event
    },
  })

  const joinEventMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apolloClient.mutate({
        mutation: JOIN_EVENT_MUTATION,
        variables: { eventId },
      })
      return data.joinEvent
    },
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(["event", eventId], updatedEvent)
      setRealTimeAttendees(updatedEvent.attendees)
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to join event")
    },
  })

  const leaveEventMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apolloClient.mutate({
        mutation: LEAVE_EVENT_MUTATION,
        variables: { eventId },
      })
      return data.leaveEvent
    },
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(["event", eventId], updatedEvent)
      setRealTimeAttendees(updatedEvent.attendees)
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to leave event")
    },
  })

  useEffect(() => {
    if (event) {
      setRealTimeAttendees(event.attendees)
    }
  }, [event])

  useEffect(() => {
    const socket = socketService.connect()

    if (socket) {
      socketService.joinEvent(eventId)

      socketService.onEventUpdate((updatedEvent: Event) => {
        if (updatedEvent.id === eventId) {
          setRealTimeAttendees(updatedEvent.attendees)
          queryClient.setQueryData(["event", eventId], updatedEvent)
        }
      })
    }

    return () => {
      socketService.leaveEvent(eventId)
      socketService.offEventUpdate()
      socketService.disconnect()
    }
  }, [eventId, queryClient])

  if (isLoading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const isAttending = realTimeAttendees.some((attendee) => attendee.id === user?.id)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.imageUrl || "/placeholder.svg?height=200&width=400" }} style={styles.eventImage} />

      <View style={styles.content}>
        <Text style={styles.eventName}>{event.name}</Text>

        {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📍 Location:</Text>
          <Text style={styles.detailValue}>{event.location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🕒 Start Time:</Text>
          <Text style={styles.detailValue}>{formatDate(event.startTime)}</Text>
        </View>

        {event.endTime && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🏁 End Time:</Text>
            <Text style={styles.detailValue}>{formatDate(event.endTime)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionButton, isAttending ? styles.leaveButton : styles.joinButton]}
          onPress={() => {
            if (isAttending) {
              leaveEventMutation.mutate()
            } else {
              joinEventMutation.mutate()
            }
          }}
          disabled={joinEventMutation.isPending || leaveEventMutation.isPending}
        >
          <Text style={styles.actionButtonText}>
            {joinEventMutation.isPending || leaveEventMutation.isPending
              ? "Loading..."
              : isAttending
                ? "Leave Event"
                : "Join Event"}
          </Text>
        </TouchableOpacity>

        <View style={styles.attendeesSection}>
          <Text style={styles.attendeesTitle}>Attendees ({realTimeAttendees.length})</Text>

          <View style={styles.attendeesList}>
            {realTimeAttendees.map((attendee) => (
              <View key={attendee.id} style={styles.attendeeItem}>
                {attendee.avatar ? (
                  <Image source={{ uri: attendee.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{getInitials(attendee.name)}</Text>
                  </View>
                )}
                <Text style={styles.attendeeName}>{attendee.name}</Text>
              </View>
            ))}
          </View>

          {realTimeAttendees.length === 0 && (
            <Text style={styles.noAttendeesText}>No attendees yet. Be the first to join!</Text>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
  },
  content: {
    padding: 20,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  eventDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  joinButton: {
    backgroundColor: "#007AFF",
  },
  leaveButton: {
    backgroundColor: "#FF3B30",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  attendeesSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  attendeesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  attendeesList: {
    gap: 12,
  },
  attendeeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  attendeeName: {
    fontSize: 16,
    color: "#333",
  },
  noAttendeesText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
})
