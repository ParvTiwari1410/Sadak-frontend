export interface User {
  id: string
  name: string
  email: string
  phone?: string
  city: string
  role: "citizen" | "authority"
  avatar?: string
  points?: number
  joinedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Mock authentication functions - in real app, these would call actual APIs
export const authService = {
  async login(email: string, password: string, role: "citizen" | "authority"): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (email === "test@example.com" && password === "password") {
      return {
        id: "1",
        name: role === "authority" ? "Municipal Officer" : "John Doe",
        email,
        city: "Gurgaon",
        role,
        points: role === "citizen" ? 150 : undefined,
        joinedAt: new Date(),
      }
    }

    throw new Error("Invalid credentials")
  },

  async signup(userData: {
    name: string
    email: string
    password: string
    phone?: string
    city: string
  }): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      city: userData.city,
      role: "citizen",
      points: 0,
      joinedAt: new Date(),
    }
  },

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async forgotPassword(email: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
}

// Form validation utilities
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return "Email is required"
  if (!emailRegex.test(email)) return "Please enter a valid email"
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required"
  if (password.length < 6) return "Password must be at least 6 characters"
  return null
}

export const validateName = (name: string): string | null => {
  if (!name) return "Name is required"
  if (name.length < 2) return "Name must be at least 2 characters"
  return null
}

export const validatePhone = (phone: string): string | null => {
  if (!phone) return null // Phone is optional
  const phoneRegex = /^[6-9]\d{9}$/
  if (!phoneRegex.test(phone)) return "Please enter a valid 10-digit phone number"
  return null
}
