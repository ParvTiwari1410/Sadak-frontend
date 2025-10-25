import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";

// Updated: Support multiple photos instead of a single imageUrl
interface ReportDetails {
  id: number;
  title: string;
  location: string;
  status: string;
  severity: string;
  description: string;
  submittedAt: string;
  photos: string[]; // Array of uploaded photo URLs
}

export function ReportDetailScreen() {
  const { id } = useLocalSearchParams(); // Get the report ID from the URL
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        // IMPORTANT: Replace with your current IP address
        const response = await fetch(
          `http://10.189.20.125:8080/api/reports/${id}`
        );
        if (!response.ok) throw new Error("Report not found");
        const data = await response.json();
        setReport(data);
      } catch (e) {
        setError("Failed to load report details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReportDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error || "Report data is unavailable."}
        </Text>
      </View>
    );
  }

  const progress =
    { Submitted: 20, "In Progress": 60, Resolved: 100 }[report.status] || 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title}>{report.title}</Text>

        {/* Metadata */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{report.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="tag" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{report.severity}</Text>
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo Evidence</Text>
          {report.photos && report.photos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {report.photos.map((photoUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: photoUrl }}
                  style={styles.reportImage}
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noPhotoText}>No photos submitted.</Text>
          )}
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status: {report.status}</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {report.description ||
              "No description was provided for this report."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "#dc2626", fontSize: 16, textAlign: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  contentContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#1f2937" },
  metaContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 14, color: "#6b7280" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#374151" },
  reportImage: {
    width: 260,
    height: 180,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  noPhotoText: { fontSize: 14, color: "#6b7280" },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: 10, backgroundColor: "#2563eb", borderRadius: 5 },
  descriptionText: { fontSize: 16, lineHeight: 24, color: "#4b5563" },
});
