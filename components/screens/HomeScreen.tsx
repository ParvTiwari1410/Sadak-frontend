"use client"

import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<any>(null);

  // --- NEW: Mock data for map markers ---
  // In a real app, you would fetch this data from your server
  const reports = [
    { id: 1, title: 'Deep Pothole', status: 'critical', coordinate: { latitude: 22.725, longitude: 75.865 } },
    { id: 2, title: 'Broken Streetlight', status: 'pending', coordinate: { latitude: 22.719, longitude: 75.857 } },
    { id: 3, title: 'Water Logging Cleared', status: 'resolved', coordinate: { latitude: 22.721, longitude: 75.845 } },
    { id: 4, title: 'Cracked Pavement', status: 'pending', coordinate: { latitude: 22.728, longitude: 75.855 } },
  ];

  // --- NEW: Color mapping for different statuses ---
  const STATUS_COLORS: { [key: string]: string } = {
    critical: '#dc2626', // Red
    pending: '#f59e0b',  // Amber
    resolved: '#16a34a', // Green
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setUserLocation({
          latitude: 22.7196, longitude: 75.8577, latitudeDelta: 0.0922, longitudeDelta: 0.0421,
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const quickActions = [
    { label: "Report Issue", description: "File a new grievance", action: () => navigation.navigate("report" as never), icon: "camera" as const, color: "#eff6ff", iconColor: "#2563eb", urgent: true },
    { label: "My Reports", description: "Track your reports", action: () => router.push('/MyReports'), icon: "check-square" as const, color: "#f0fdf4", iconColor: "#16a34a", urgent: false },
    { label: "Community Feed", description: "See all reports", action: () => navigation.navigate("feed" as never), icon: "message-square" as const, color: "#f5f3ff", iconColor: "#7c3aed", urgent: false },
    { 
  label: "Nearby Hazards",
  description: "View nearby issues",
  action: () => navigation.navigate("nearbyhazards" as never),
  icon: "map" as const,
  color: "#fffbeb",
  iconColor: "#f59e0b",
  urgent: false 
},



  ] as const;

  const stats = {
    totalReports: 12, pendingReports: 5, criticalReports: 2, resolvedToday: 3,
  };
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Welcome, {user.name}!</Text>
                <Text style={styles.headerSubtitle}>Your Road. Your Voice.</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton}>
                  <Feather name="bell" size={18} color="#ffffff" />
                  {stats.criticalReports > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{stats.criticalReports}</Text></View>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("profile" as never)}>
                  <Feather name="user" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.searchContainer}>
              <Feather name="search" size={16} color="rgba(255,255,255,0.7)" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search reports by location..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={14} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
              <Text style={styles.locationText}>Indore, Madhya Pradesh</Text>
            </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}><Text style={[styles.statNumber, { color: "#2563eb" }]}>{stats.totalReports}</Text><Text style={styles.statLabel}>Total</Text></View>
          <View style={styles.statCard}><Text style={[styles.statNumber, { color: "#eab308" }]}>{stats.pendingReports}</Text><Text style={styles.statLabel}>Pending</Text></View>
          <View style={styles.statCard}><Text style={[styles.statNumber, { color: "#dc2626" }]}>{stats.criticalReports}</Text><Text style={styles.statLabel}>Critical</Text></View>
          <View style={styles.statCard}><Text style={[styles.statNumber, { color: "#16a34a" }]}>{stats.resolvedToday}</Text><Text style={styles.statLabel}>Resolved</Text></View>
        </View>

        {user.role === "authority" && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.authorityButton} onPress={() => router.push('/Authority')}>
              <Feather name="shield" size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.authorityButtonText}>Open Authority Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Map</Text>
          <View style={styles.mapContainer}>
            {userLocation ? (
              <MapView style={styles.map} initialRegion={userLocation}>
                {/* --- UPDATED: Custom marker for user's location --- */}
                <Marker coordinate={userLocation} title="Your Location">
                    <View style={styles.userLocationAccuracyCircle}>
                        <View style={styles.userLocationDot} />
                    </View>
                </Marker>

                {/* --- NEW: Loop through reports to create custom markers --- */}
                {reports.map(report => (
                  <Marker
                    key={report.id}
                    coordinate={report.coordinate}
                    title={report.title}
                    description={`Status: ${report.status}`}
                  >
                    <View style={styles.markerWrapper}>
                      <View style={[styles.markerOuterCircle, { backgroundColor: STATUS_COLORS[report.status] }]}>
                          <View style={[styles.markerInnerCircle, { backgroundColor: STATUS_COLORS[report.status] }]}/>
                      </View>
                    </View>
                  </Marker>
                ))}
              </MapView>
            ) : (
              <ActivityIndicator size="large" color="#2563eb"/>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, action.urgent && styles.actionCardUrgent]}
                onPress={action.action}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Feather name={action.icon} size={20} color={action.iconColor} />
                  {action.urgent && <View style={styles.urgentDot} />}
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Priority Reports</Text>
              <TouchableOpacity onPress={() => navigation.navigate("feed" as never)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={[styles.reportStatusIcon, { backgroundColor: "#eab308" }]}>
                  <Feather name="clock" size={16} color="white" />
                </View>
                <View style={styles.reportInfo}>
                  <View style={styles.reportTitleRow}>
                    <Text style={styles.reportTitle}>Pothole</Text>
                    <View style={styles.reportBadge}><Text style={styles.reportBadgeText}>pending</Text></View>
                    <View style={[styles.reportSeverityBadge, { backgroundColor: "#fed7aa" }]}><Text style={[styles.reportSeverityText, { color: "#ea580c" }]}>high</Text></View>
                  </View>
                  <Text style={styles.reportLocation}>MG Road, Sector 14</Text>
                  <Text style={styles.reportDescription}>Large pothole causing traffic issues...</Text>
                  <View style={styles.reportMeta}><Text style={styles.reportMetaText}>2h ago • 12 upvotes</Text></View>
                </View>
              </View>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (all your existing styles are kept the same)
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: "#2563eb", paddingTop: 50, paddingHorizontal: 16, paddingBottom: 60, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  headerActions: { flexDirection: "row", gap: 12 },
  headerButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", position: "relative" },
  badge: { position: "absolute", top: 0, right: 0, backgroundColor: "#dc2626", borderRadius: 8, width: 16, height: 16, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "white", fontSize: 10, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, paddingVertical: 12, color: "white", fontSize: 14 },
  locationContainer: { flexDirection: "row", alignItems: "center" },
  locationText: { color: "rgba(255,255,255,0.9)", fontSize: 14 },
  section: { paddingHorizontal: 16, marginTop: 16 },
  statsSection: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: -40, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: "white", borderRadius: 12, paddingVertical: 16, paddingHorizontal: 8, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  statNumber: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  authorityButton: { backgroundColor: "#7c3aed", borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  authorityButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  mapContainer: { height: 200, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#1f2937", marginBottom: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  viewAllText: { color: "#2563eb", fontSize: 14, fontWeight: "500" },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', rowGap: 12 },
  actionCard: { width: "48%", backgroundColor: "white", borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  actionCardUrgent: { borderWidth: 1, borderColor: "#ef4444" },
  actionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 12, position: "relative" },
  urgentDot: { position: "absolute", top: 0, right: 0, width: 10, height: 10, backgroundColor: "#dc2626", borderRadius: 5, borderWidth: 2, borderColor: 'white' },
  actionContent: { gap: 4 },
  actionLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  actionDescription: { fontSize: 12, color: "#6b7280" },
  reportCard: { backgroundColor: "white", borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  reportHeader: { flexDirection: "row", gap: 12, alignItems: 'center' },
  reportStatusIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  reportInfo: { flex: 1 },
  reportTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  reportTitle: { fontSize: 14, fontWeight: "600", color: "#374151" },
  reportBadge: { backgroundColor: "#fef3c7", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  reportBadgeText: { fontSize: 10, color: "#92400e", textTransform: "capitalize", fontWeight: '500' },
  reportSeverityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  reportSeverityText: { fontSize: 10, fontWeight: "500", textTransform: "capitalize" },
  reportLocation: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
  reportDescription: { fontSize: 12, color: "#374151", marginBottom: 8 },
  reportMeta: { flexDirection: "row" },
  reportMetaText: { fontSize: 12, color: "#6b7280" },

  // --- NEW STYLES FOR CUSTOM MAP MARKERS ---
  markerWrapper: {
    // This wrapper helps with positioning and potential animations
  },
  markerOuterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  userLocationAccuracyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb', // blue-600
    borderWidth: 2,
    borderColor: 'white',
  },
});