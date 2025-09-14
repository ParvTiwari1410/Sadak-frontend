import type * as React from "react"
import { Text as RNText, StyleSheet } from "react-native"

interface TextProps extends React.ComponentProps<typeof RNText> {
  variant?: "default" | "title" | "subtitle" | "caption" | "muted"
}

function Text({ children, variant = "default", style, ...rest }: TextProps) {
  const getTextStyle = () => {
    switch (variant) {
      case "title":
        return styles.title
      case "subtitle":
        return styles.subtitle
      case "caption":
        return styles.caption
      case "muted":
        return styles.muted
      default:
        return styles.default
    }
  }

  return (
    <RNText style={[getTextStyle(), style]} {...rest}>
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  muted: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 20,
  },
})

export { Text }
