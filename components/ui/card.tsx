import type * as React from "react"
import { View, StyleSheet } from "react-native"

interface CardProps {
  children: React.ReactNode
  style?: any
}

function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>
}

function CardHeader({ children, style }: CardProps) {
  return <View style={[styles.cardHeader, style]}>{children}</View>
}

function CardTitle({ children, style }: CardProps) {
  return <View style={[styles.cardTitle, style]}>{children}</View>
}

function CardDescription({ children, style }: CardProps) {
  return <View style={[styles.cardDescription, style]}>{children}</View>
}

function CardContent({ children, style }: CardProps) {
  return <View style={[styles.cardContent, style]}>{children}</View>
}

function CardFooter({ children, style }: CardProps) {
  return <View style={[styles.cardFooter, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardFooter: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
})

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
