// app/screens/NearbyHazardsScreen.tsx
import React, { useState, useEffect, useRef } from "react"
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  AppState,
  AppStateStatus 
} from "react-native"
import MapView, { Marker } from "react-native-maps"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import * as Location from 'expo-location'
import { hazardApi, localHazardService, Hazard } from '../../services/hazardApi'

const MAX_DISTANCE_KM = 2

export const NearbyHazardsScreen: React.FC = () => {
  const router = useRouter()
  const mapRef = useRef<MapView>(null)
  
  const [region, setRegion] = useState({
    latitude: 22.7196,
    longitude: 75.8577,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  })
  
  const [hazards, setHazards] = useState<Hazard[]>([])
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeLocationAndHazards()
    
    // Set up app state listener for when app comes to foreground
    const subscription = AppState.addEventListener('change', handleAppStateChange)
    
    return () => {
      subscription.remove()
    }
  }, [])

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // Refresh hazards when app comes to foreground
      checkForNewHazards()
    }
  }

  const initializeLocationAndHazards = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Sync any locally stored hazards first
      await localHazardService.syncLocalHazards()

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync()
      
      if (status !== 'granted') {
        setError('Location permission is required to show nearby hazards')
        setLoading(false)
        return
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      })
      const { latitude, longitude } = location.coords
      
      setUserLocation({ latitude, longitude })
      setRegion(prev => ({
        ...prev,
        latitude,
        longitude,
      }))

      // Load hazards from backend
      await loadHazardsFromBackend(latitude, longitude)
      
    } catch (error) {
      console.error('Error initializing:', error)
      setError('Failed to load hazards. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const loadHazardsFromBackend = async (userLat: number, userLng: number) => {
    try {
      const backendHazards = await hazardApi.getNearbyHazards(userLat, userLng, MAX_DISTANCE_KM)
      
      // Also load local hazards as fallback
      const localHazards = await localHazardService.getLocalHazards()
      
      // Filter local hazards by distance
      const nearbyLocalHazards = localHazards.filter(hazard => {
        const distance = calculateDistance(
          userLat,
          userLng,
          hazard.coordinate.latitude,
          hazard.coordinate.longitude
        )
        return distance <= MAX_DISTANCE_KM
      })

      // Combine and sort hazards
      const allHazards = [...backendHazards, ...nearbyLocalHazards]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setHazards(allHazards)
      setError(null)
    } catch (error) {
      console.error('Error loading hazards from backend:', error)
      
      // Fallback to local hazards
      const localHazards = await localHazardService.getLocalHazards()
      setHazards(localHazards)
      setError('Using offline data. Some hazards may not be current.')
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const checkForNewHazards = async () => {
    if (!userLocation) {
      await initializeLocationAndHazards()
      return
    }
    
    setRefreshing(true)
    try {
      await loadHazardsFromBackend(userLocation.latitude, userLocation.longitude)
    } catch (error) {
      console.error('Error refreshing hazards:', error)
      Alert.alert('Refresh Failed', 'Could not update hazards. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    await checkForNewHazards()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#FF3B30'
      case 'MODERATE': return '#FF9500'
      case 'MINOR': return '#4CD964'
      default: return '#8E8E93'
    }
  }

  const getHazardTypeIcon = (hazardType: string | undefined) => {
  switch (hazardType) {
    case 'POTHOLE': return '⚫'
    case 'WATERLOGGING': return '💧'
    case 'STREETLIGHT': return '💡'
    case 'ROAD_DAMAGE': return '🚧'
    default: return '⚠️'
  }
}

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const navigateToReportScreen = () => {
    // Navigate to your report screen
    router.push('/report-hazard')
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding nearby hazards...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Hazards</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={navigateToReportScreen} style={styles.addButton}>
            <Ionicons name="add" size={22} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton} disabled={refreshing}>
            <Ionicons 
              name="refresh" 
              size={22} 
              color={refreshing ? "#CCC" : "#007AFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning" size={16} color="#FFF" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <MapView 
        ref={mapRef}
        style={styles.map} 
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {hazards.map((hazard) => (
          <Marker
            key={hazard.id}
            coordinate={hazard.coordinate}
            title={hazard.title}
            description={`${hazard.severity} • ${hazard.distance}`}
            pinColor={getSeverityColor(hazard.severity)}
          />
        ))}
      </MapView>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          Nearby Hazards ({hazards.length} within {MAX_DISTANCE_KM} km)
        </Text>
        {refreshing && <ActivityIndicator size="small" color="#007AFF" />}
      </View>

      <FlatList
        data={hazards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => {
              // Zoom to hazard on map
              mapRef.current?.animateToRegion({
                ...item.coordinate,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 1000)
            }}
          >
            <View style={styles.cardHeader}>
              <View style={styles.hazardInfo}>
                <Text style={styles.hazardType}>
  {getHazardTypeIcon(item.hazardType)} {item.hazardType ? item.hazardType.replace('_', ' ') : 'Other'}
</Text>
                <Text style={styles.hazardTitle}>{item.title}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getSeverityColor(item.severity) }]}>
                <Text style={styles.badgeText}>{item.severity}</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.distanceText}>{item.distance} away</Text>
              <Text style={styles.timestampText}>
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
            {item.status !== 'REPORTED' && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>No Hazards Nearby</Text>
            <Text style={styles.emptyText}>
              Great news! No road hazards reported within {MAX_DISTANCE_KM} km of your location.
            </Text>
            <TouchableOpacity style={styles.reportButton} onPress={navigateToReportScreen}>
              <Text style={styles.reportButtonText}>Report a Hazard</Text>
            </TouchableOpacity>
          </View>
        }
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
  headerButtons: { flexDirection: "row", marginLeft: "auto" },
  addButton: { padding: 8, marginRight: 8 },
  refreshButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#333" },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  map: { width: "100%", height: "45%" },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  listContainer: { padding: 12, flexGrow: 1 },
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
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    justifyContent: "space-between",
    marginBottom: 8,
  },
  hazardInfo: { flex: 1, marginRight: 8 },
  hazardType: { 
    fontSize: 12, 
    color: "#666", 
    marginBottom: 4,
    textTransform: 'capitalize'
  },
  hazardTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#222", 
    flex: 1,
  },
  badge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  badgeText: { 
    fontSize: 12, 
    color: "#fff", 
    fontWeight: "600",
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: { 
    color: "#666", 
    fontSize: 14,
    fontWeight: '500',
  },
  timestampText: { 
    color: "#999", 
    fontSize: 12,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#f7f9fc"
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: "#666" 
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  reportButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reportButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
})