"use client"

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Image } from "react-native";
import { router } from 'expo-router';
import { Feather } from "@expo/vector-icons";
import Constants from 'expo-constants';

// Define the structure of the Report data, including optional photos and date
interface UserReport {
  id: string;
  title: string;
  location: string;
  status: string;
  severity: string;
  submittedAt?: string;
  photos?: string[];
}

// --- Helper Data for UI (This doesn't change your logic) ---
const issueCategories = {
  pothole: { label: 'Pothole', icon: 'alert-triangle' as const, color: '#dc2626' },
  waterlogging: { label: 'Waterlogging', icon: 'cloud-drizzle' as const, color: '#2563eb' },
  utility: { label: 'Utility Repair', icon: 'tool' as const, color: '#ea580c' },
  violence: { label: 'Violence/Nuisance', icon: 'shield' as const, color: '#7c3aed' },
  other: { label: 'Other', icon: 'more-horizontal' as const, color: '#6b7280' },
};

const severityLevels = {
  low: { label: 'Low', color: '#16a34a' },
  medium: { label: 'Medium', color: '#ca8a04' },
  high: { label: 'High', color: '#ea580c' },
  critical: { label: 'Critical', color: '#dc2626' },
};

const statusColors = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#16a34a',
  Submitted: '#f59e0b', // Added Submitted status
};

// --- Helper Functions for UI ---
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getCategoryFromTitle = (title: string): keyof typeof issueCategories => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pothole')) return 'pothole';
    if (lowerTitle.includes('water')) return 'waterlogging';
    if (lowerTitle.includes('utility')) return 'utility';
    // Add other keywords as needed
    return 'other';
};


export function MyReportsScreen() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://192.168.1.101:8080/api/reports');; // Using your new IP
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data);
      } catch (e) {
        setError("Could not load reports. Please try again later.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // --- UPDATED RENDER FUNCTION WITH NEW UI ---
  const renderReportItem = ({item}: {item: UserReport}) => {
    const categoryKey = getCategoryFromTitle(item.title);
    const categoryInfo = issueCategories[categoryKey];
    const severityInfo = severityLevels[item.severity as keyof typeof severityLevels] || { label: item.severity, color: '#6b7280' };
    const statusColor = statusColors[item.status as keyof typeof statusColors] || '#6b7280';
    
    return (
      <TouchableOpacity style={styles.reportCard} onPress={() => router.push(`/reports/${item.id}`)}>
        {/* Left Icon */}
        <View style={[styles.categoryIconContainer, { backgroundColor: categoryInfo.color }]}>
          <Feather name={categoryInfo.icon} size={24} color="#ffffff" />
        </View>

        {/* Center Content */}
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{categoryInfo.label}</Text>

          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: statusColor }]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: severityInfo.color }]}>
              <Text style={styles.badgeText}>{severityInfo.label} Severity</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color="#6b7280" />
            <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
          </View>

           <Text style={styles.dateText}>Reported on {formatDate(item.submittedAt)}</Text>
        </View>

        {/* Right Thumbnail & Chevron */}
        {item.photos && item.photos.length > 0 && (
           <Image source={{ uri: item.photos[0] }} style={styles.thumbnail} />
        )}
        <Feather name="chevron-right" size={20} color="#9ca3af" />
      </TouchableOpacity>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" style={{marginTop: 50}} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    return (
      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="file-text" size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No Reports Found</Text>
            <Text style={styles.emptySubtitle}>You haven't submitted any reports yet.</Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Feather name="x" size={24} color="#111827" />
        </TouchableOpacity>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // Changed to a light gray background
    paddingTop: Constants.statusBarHeight 
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { padding: 8 },
  listContainer: { padding: 16, gap: 16 }, // Added gap for spacing
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: '30%' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 8 },
  errorText: { textAlign: 'center', marginTop: 50, color: '#dc2626' },

  // --- NEW STYLES FOR THE REPORT CARD ---
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportInfo: {
    flex: 1,
    gap: 6,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap', // Allows badges to wrap on smaller screens
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  locationContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  locationText: { 
    fontSize: 13, 
    color: '#6b7280',
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#e5e7eb' // Added a background color for when image is loading
  },
});