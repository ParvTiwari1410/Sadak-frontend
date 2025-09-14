import type * as React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "@/components/ui/text"

interface AlertProps {
  variant?: "default" | "destructive"
  children: React.ReactNode
  style?: any
}

function Alert({ variant = "default", children, style, ...props }: AlertProps) {
  return (
    <View style={[styles.alert, variant === "destructive" ? styles.destructive : styles.default, style]} {...props}>
      {children}
    </View>
  )
}

function AlertTitle({ children, style, ...props }: { children: React.ReactNode; style?: any }) {
  return (
    <Text style={[styles.alertTitle, style]} {...props}>
      {children}
    </Text>
  )
}

function AlertDescription({ children, style, ...props }: { children: React.ReactNode; style?: any }) {
  return (
    <Text style={[styles.alertDescription, style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  alert: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
  },
  default: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },
  destructive: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
})

export { Alert, AlertTitle, AlertDescription }
