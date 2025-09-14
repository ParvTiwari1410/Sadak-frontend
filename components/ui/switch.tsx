import { View, type ViewStyle } from "react-native"

interface ProgressProps {
  value?: number
  className?: string
  style?: ViewStyle
}

function Progress({ value = 0, className, style, ...props }: ProgressProps) {
  return (
    <View
      style={[
        {
          height: 8,
          backgroundColor: "#e5e7eb",
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          height: "100%",
          backgroundColor: "#3b82f6",
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          borderRadius: 4,
        }}
      />
    </View>
  )
}

export { Progress }
