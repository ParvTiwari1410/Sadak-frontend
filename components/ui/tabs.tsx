"use client"

import * as React from "react"
import { View, Text, TouchableOpacity, type ViewProps, StyleSheet } from "react-native"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

interface TabsProps extends ViewProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface TabsListProps extends ViewProps {
  children: React.ReactNode
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  style?: any
}

interface TabsContentProps extends ViewProps {
  value: string
  children: React.ReactNode
}

function Tabs({ defaultValue, value, onValueChange, children, style, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || "")

  const handleTabChange = (newValue: string) => {
    if (!value) {
      setActiveTab(newValue)
    }
    onValueChange?.(newValue)
  }

  const contextValue = {
    activeTab: value || activeTab,
    setActiveTab: handleTabChange,
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <View style={[styles.tabs, style]} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  )
}

function TabsList({ children, style, ...props }: TabsListProps) {
  return (
    <View style={[styles.tabsList, style]} {...props}>
      {children}
    </View>
  )
}

function TabsTrigger({ value, children, style }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const isActive = context.activeTab === value

  return (
    <TouchableOpacity
      style={[styles.tabsTrigger, isActive && styles.tabsTriggerActive, style]}
      onPress={() => context.setActiveTab(value)}
    >
      <Text style={[styles.tabsTriggerText, isActive && styles.tabsTriggerTextActive]}>{children}</Text>
    </TouchableOpacity>
  )
}

function TabsContent({ value, children, style, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  if (context.activeTab !== value) return null

  return (
    <View style={[styles.tabsContent, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "column",
    gap: 8,
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 3,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsTriggerActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabsTriggerTextActive: {
    color: "#111827",
  },
  tabsContent: {
    flex: 1,
  },
})

export { Tabs, TabsList, TabsTrigger, TabsContent }
