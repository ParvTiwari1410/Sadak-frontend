"use client"

import type * as React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { ChevronDown } from "lucide-react-native"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  placeholder?: string
}

function Select({ value, onValueChange, children, placeholder }: SelectProps) {
  return (
    <View style={styles.selectContainer}>
      <Picker selectedValue={value} onValueChange={onValueChange} style={styles.picker}>
        {placeholder && <Picker.Item label={placeholder} value="" enabled={false} />}
        {children}
      </Picker>
    </View>
  )
}

function SelectItem({ label, value }: { label: string; value: string }) {
  return <Picker.Item label={label} value={value} />
}

function SelectTrigger({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.trigger} onPress={onPress}>
      <Text style={styles.triggerText}>{children}</Text>
      <ChevronDown size={16} color="#666" />
    </TouchableOpacity>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  return <Text style={styles.placeholder}>{placeholder}</Text>
}

const styles = StyleSheet.create({
  selectContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  picker: {
    height: 40,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  triggerText: {
    fontSize: 14,
    color: "#374151",
  },
  placeholder: {
    fontSize: 14,
    color: "#9ca3af",
  },
})

export { Select, SelectItem, SelectTrigger, SelectValue }
