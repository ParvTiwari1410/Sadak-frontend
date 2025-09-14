import type * as React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "./text"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  style?: any
}

function Badge({ children, variant = "default", style }: BadgeProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondary
      case "destructive":
        return styles.destructive
      case "outline":
        return styles.outline
      default:
        return styles.default
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "secondary":
        return "#374151"
      case "destructive":
        return "#ffffff"
      case "outline":
        return "#374151"
      default:
        return "#ffffff"
    }
  }

  return (
    <View style={[styles.badge, getBadgeStyle(), style]}>
      <Text style={[styles.text, { color: getTextColor() }]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  default: {
    backgroundColor: "#3b82f6",
  },
  secondary: {
    backgroundColor: "#f1f5f9",
  },
  destructive: {
    backgroundColor: "#ef4444",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
})

export { Badge }
