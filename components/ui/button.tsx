import type * as React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface ButtonProps {
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

function Button({ children, variant = "default", size = "default", onPress, disabled = false }: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = styles.button

    switch (variant) {
      case "destructive":
        return [baseStyle, styles.destructive]
      case "outline":
        return [baseStyle, styles.outline]
      case "secondary":
        return [baseStyle, styles.secondary]
      case "ghost":
        return [baseStyle, styles.ghost]
      case "link":
        return [baseStyle, styles.link]
      default:
        return [baseStyle, styles.default]
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "destructive":
        return styles.destructiveText
      case "outline":
        return styles.outlineText
      case "secondary":
        return styles.secondaryText
      case "ghost":
        return styles.ghostText
      case "link":
        return styles.linkText
      default:
        return styles.defaultText
    }
  }

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.sm
      case "lg":
        return styles.lg
      case "icon":
        return styles.icon
      default:
        return styles.defaultSize
    }
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), getSizeStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[getTextStyle(), disabled && styles.disabledText]}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  default: {
    backgroundColor: "#3b82f6",
  },
  destructive: {
    backgroundColor: "#ef4444",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondary: {
    backgroundColor: "#f1f5f9",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  link: {
    backgroundColor: "transparent",
  },
  defaultSize: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lg: {
    height: 40,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  icon: {
    height: 36,
    width: 36,
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  defaultText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  destructiveText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  outlineText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  secondaryText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  ghostText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  linkText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  disabledText: {
    opacity: 0.5,
  },
})

export { Button }
