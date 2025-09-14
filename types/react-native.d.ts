declare module "react-native" {
  export * from "react-native/types"
}

declare module "@expo/vector-icons" {
  export * from "@expo/vector-icons/build/createIconSet"
  export { default as Ionicons } from "@expo/vector-icons/build/Ionicons"
  export { default as MaterialIcons } from "@expo/vector-icons/build/MaterialIcons"
  export { default as FontAwesome } from "@expo/vector-icons/build/FontAwesome"
  export { default as Feather } from "@expo/vector-icons/build/Feather"
}

import type { ComponentType } from "react"
import type { ParamListBase } from "@react-navigation/native"
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"

// ✅ Patch for Tab.Screen
declare module "@react-navigation/bottom-tabs" {
  export interface BottomTabNavigationOptions {
    component?: ComponentType<any>
  }

  export interface BottomTabNavigationConfig {
    component?: ComponentType<any>
  }
}

// ✅ Patch for Stack.Screen
declare module "@react-navigation/stack" {
  export interface StackNavigationOptions {
    component?: ComponentType<any>
  }

  export interface StackNavigationConfig {
    component?: ComponentType<any>
  }
}

