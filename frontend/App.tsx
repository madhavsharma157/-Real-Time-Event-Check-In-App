"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ApolloProvider } from "@apollo/client"
import * as SecureStore from "expo-secure-store"

import { apolloClient } from "./src/lib/apollo"
import { useAuthStore } from "./src/store/authStore"
import LoginScreen from "./src/screens/LoginScreen"
import EventListScreen from "./src/screens/EventListScreen"
import EventDetailScreen from "./src/screens/EventDetailScreen"

const Stack = createNativeStackNavigator()
const queryClient = new QueryClient()

export default function App() {
  const { isAuthenticated, user, token } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token")
        if (storedToken) {
          // You would typically validate the token here
          // For now, we'll just check if it exists
          useAuthStore.setState({
            token: storedToken,
            isAuthenticated: true,
          })
        }
      } catch (error) {
        console.error("Error checking auth state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthState()
  }, [])

  if (isLoading) {
    return null // Or a loading screen
  }

  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <>
                <Stack.Screen name="EventList" component={EventListScreen} />
                <Stack.Screen
                  name="EventDetail"
                  component={EventDetailScreen}
                  options={{
                    headerShown: true,
                    title: "Event Details",
                    headerBackTitle: "Back",
                  }}
                />
              </>
            ) : (
              <Stack.Screen name="Login" component={LoginScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </ApolloProvider>
  )
}
