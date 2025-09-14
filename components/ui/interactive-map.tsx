"use client"

import { useState } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Card, CardContent } from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import { Ionicons } from "@expo/vector-icons"

export interface MapReport {
  id: string
  type: "pothole" | "waterlogging" | "utility" | "violence" | "other"
  location: {
    lat: number
    lng: number
    address: string
  }
  status: "pending" | "verified" | "in-progress" | "resolved"
  severity: "low" | "medium" | "high" | "critical"
  reportedAt: Date
  reportedBy: string
  description: string
  imageUrl?: string
  upvotes: number
  downvotes: number
}

interface InteractiveMapProps {
  reports: MapReport[]
  onReportClick: (report: MapReport) => void
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void
  style?: any
}

const issueTypeConfig = {
  pothole: { icon: "warning", color: "#ef4444", label: "Pothole" },
  waterlogging: { icon: "water", color: "#3b82f6", label: "Waterlogging" },
  utility: { icon: "construct", color: "#f97316", label: "Utility Repair" },
  violence: { icon: "shield", color: "#8b5cf6", label: "Violence/Nuisance" },
  other: { icon: "ellipsis-horizontal", color: "#6b7280", label: "Other" },
}

export function InteractiveMap({ reports, onReportClick, onLocationChange, style }: InteractiveMapProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.4595,
    lng: 77.0266,
    address: "Sector 14, Gurgaon",
  })
  const [isLocating, setIsLocating] = useState(false)

  const filteredReports = reports.filter((report) => activeFilters.length === 0 || activeFilters.includes(report.type))

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) => (prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]))
  }

  const getCurrentLocation = () => {
    setIsLocating(true)
    setTimeout(() => {
      const newLocation = {
        lat: 28.4595 + (Math.random() - 0.5) * 0.01,
        lng: 77.0266 + (Math.random() - 0.5) * 0.01,
        address: "Current Location",
      }
      setCurrentLocation(newLocation)
      onLocationChange(newLocation)
      setIsLocating(false)
    }, 1000)
  }

  return (
    <Card style={style}>
      <CardContent style={styles.container}>
        {/* Map Controls */}
        <View style={styles.controls}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            <View style={styles.filters}>
              {Object.entries(issueTypeConfig).map(([type, config]) => {
                const isActive = activeFilters.includes(type)
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.filterButton, { backgroundColor: isActive ? config.color : "#ffffff" }]}
                    onPress={() => toggleFilter(type)}
                  >
                    <Ionicons name={config.icon as any} size={12} color={isActive ? "#ffffff" : "#374151"} />
                    <Text style={[styles.filterText, { color: isActive ? "#ffffff" : "#374151" }]}>{config.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation} disabled={isLocating}>
            <Ionicons name="navigate" size={12} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Map Area */}
        <View style={styles.mapContainer}>
          {/* Current Location Indicator */}
          <View style={styles.currentLocationPin}>
            <View style={styles.currentLocationDot} />
          </View>

          {/* Report Pins */}
          {filteredReports.map((report, index) => {
            const config = issueTypeConfig[report.type]
            const x = 20 + ((index * 60) % 260)
            const y = 30 + ((index * 40) % 180)

            return (
              <TouchableOpacity
                key={report.id}
                style={[styles.reportPin, { left: x, top: y, backgroundColor: config.color }]}
                onPress={() => onReportClick(report)}
              >
                <Ionicons name={config.icon as any} size={16} color="#ffffff" />
                {report.severity === "critical" && (
                  <View style={styles.criticalIndicator}>
                    <Ionicons name="flash" size={8} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>
            )
          })}

          {/* Location Info */}
          <View style={styles.locationInfo}>
            <View style={styles.locationInfoContent}>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color="#3b82f6" />
                <Text style={styles.locationText}>{currentLocation.address}</Text>
              </View>
              <Text style={styles.reportsCount}>{filteredReports.length} reports in this area</Text>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  controls: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  filtersContainer: {
    flex: 1,
    marginRight: 8,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    height: 32,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "500",
  },
  locationButton: {
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 6,
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    height: 256,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
  },
  currentLocationPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    zIndex: 20,
  },
  currentLocationDot: {
    width: 16,
    height: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  reportPin: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  criticalIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    backgroundColor: "#ef4444",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  locationInfo: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  locationInfoContent: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  reportsCount: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
})
