import React, { useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

export const NearbyHazardsScreen: React.FC = () => {
  const router = useRouter()

  const [region] = useState({
    latitude: 22.7196,
    longitude: 75.8577,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  })

  const hazards = [
    {
      id: "1",
      title: "Pothole near AB Road",
      severity: "Critical",
      distance: "0.8 km",
      coordinate: { latitude: 22.724, longitude: 75.857 },
      color: "red",
    },
    {
      id: "2",
      title: "Broken Streetlight at Palasia",
      severity: "Moderate",
      distance: "1.2 km",
      coordinate: { latitude: 22.72, longitude: 75.86 },
      color: "orange",
    },
    {
      id: "3",
      title: "Waterlogging near Rajwada",
      severity: "Minor",
      distance: "2.1 km",
      coordinate: { latitude: 22.718, longitude: 75.86 },
      color: "green",
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Hazards</Text>
        <TouchableOpacity onPress={() => {}} style={styles.refreshButton}>
          <Ionicons name="refresh" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <MapView style={styles.map} initialRegion={region}>
        {hazards.map((h) => (
          <Marker
            key={h.id}
            coordinate={h.coordinate}
            title={h.title}
            description={`${h.severity} • ${h.distance}`}
            pinColor={h.color}
          />
        ))}
      </MapView>

      <FlatList
        data={hazards}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.hazardTitle}>{item.title}</Text>
              <View style={[styles.badge, { backgroundColor: item.color }]}>
                <Text style={styles.badgeText}>{item.severity}</Text>
              </View>
            </View>
            <Text style={styles.distanceText}>{item.distance} away</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  backButton: { padding: 8, marginRight: 10 },
  refreshButton: { padding: 8, marginLeft: "auto" },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#333" },
  map: { width: "100%", height: "45%" },
  listContainer: { padding: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  hazardTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, color: "#fff", fontWeight: "600" },
  distanceText: { marginTop: 6, color: "#666", fontSize: 14 },
})
