import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from "react-native"
import { useQuery } from "@tanstack/react-query"
import { apolloClient } from "../lib/apollo"
import { GET_EVENTS } from "../graphql/queries"
import type { Event } from "../types"
import { useAuthStore } from "../store/authStore"

interface Props {
  navigation: any
}

export default function EventListScreen({ navigation }: Props) {
  const { logout } = useAuthStore()

  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_EVENTS,
        fetchPolicy: "network-only",
      })
      return data.events
    },
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}>
      <Image source={{ uri: item.imageUrl || "/placeholder.svg?height=120&width=200" }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
        <Text style={styles.eventTime}>{formatDate(item.startTime)}</Text>
        <View style={styles.attendeeInfo}>
          <Text style={styles.attendeeCount}>
            {item.attendeeCount} {item.attendeeCount === 1 ? "attendee" : "attendees"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: "#007AFF",
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#e0e0e0",
  },
  eventInfo: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 8,
  },
  attendeeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeeCount: {
    fontSize: 12,
    color: "#999",
  },
})
