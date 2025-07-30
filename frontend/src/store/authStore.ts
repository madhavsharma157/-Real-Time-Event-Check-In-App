import { create } from "zustand"
import * as SecureStore from "expo-secure-store"
import type { AuthState } from "../types"
import { apolloClient } from "../lib/apollo"
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../graphql/mutations"

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password },
      })

      const { token, user } = data.login

      await SecureStore.setItemAsync("token", token)

      set({
        user,
        token,
        isAuthenticated: true,
      })
    } catch (error) {
      throw error
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: { name, email, password },
      })

      const { token, user } = data.register

      await SecureStore.setItemAsync("token", token)

      set({
        user,
        token,
        isAuthenticated: true,
      })
    } catch (error) {
      throw error
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token")
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },
}))
