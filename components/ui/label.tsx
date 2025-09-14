import type * as React from "react"
import { Text, type TextProps, StyleSheet } from "react-native"

interface LabelProps extends TextProps {
  children: React.ReactNode
}

function Label({ style, children, ...props }: LabelProps) {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
})

export { Label }
