"use client"

import type React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "@/lib/auth"

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("sadak-saathi-user")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          dispatch({ type: "LOGIN_SUCCESS", payload: user })
        }
      } catch (error) {
        await AsyncStorage.removeItem("sadak-saathi-user")
      }
    }
    loadUser()
  }, [])

  // Save user to AsyncStorage when authenticated
  useEffect(() => {
    const saveUser = async () => {
      try {
        if (state.user) {
          await AsyncStorage.setItem("sadak-saathi-user", JSON.stringify(state.user))
        } else {
          await AsyncStorage.removeItem("sadak-saathi-user")
        }
      } catch (error) {
        console.error("Failed to save user data:", error)
      }
    }
    saveUser()
  }, [state.user])

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
