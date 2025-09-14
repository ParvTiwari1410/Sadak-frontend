import { TextInput, StyleSheet } from "react-native"

interface InputProps {
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  secureTextEntry?: boolean
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
  multiline?: boolean
  numberOfLines?: number
  style?: any
  editable?: boolean
}

function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  style,
  editable = true,
}: InputProps) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.multiline, !editable && styles.disabled, style]}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      editable={editable}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#ffffff",
    color: "#374151",
    height: 36,
  },
  multiline: {
    height: 80,
    textAlignVertical: "top",
  },
  disabled: {
    backgroundColor: "#f9fafb",
    opacity: 0.5,
  },
})

export { Input }
