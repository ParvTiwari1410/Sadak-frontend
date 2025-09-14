import type * as React from "react"
import { View } from "react-native"

interface ToasterProps {
  children?: React.ReactNode
}

const Toaster = ({ children }: ToasterProps) => {
  // Placeholder implementation for React Native
  // In a real app, you'd use react-native-toast-message or similar
  return <View>{children}</View>
}

export { Toaster }
