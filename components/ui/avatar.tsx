import type * as React from "react"
import { View, Image, Text, type ViewProps, type ImageProps, StyleSheet } from "react-native"

interface AvatarProps extends ViewProps {
  size?: number
}

interface AvatarImageProps extends ImageProps {
  source: { uri: string } | number
}

interface AvatarFallbackProps extends ViewProps {
  children: React.ReactNode
}

function Avatar({ style, size = 32, ...props }: AvatarProps) {
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]} {...props} />
}

function AvatarImage({ style, source, ...props }: AvatarImageProps) {
  return <Image style={[styles.avatarImage, style]} source={source} {...props} />
}

function AvatarFallback({ style, children, ...props }: AvatarFallbackProps) {
  return (
    <View style={[styles.avatarFallback, style]} {...props}>
      <Text style={styles.fallbackText}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  fallbackText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
})

export { Avatar, AvatarImage, AvatarFallback }
