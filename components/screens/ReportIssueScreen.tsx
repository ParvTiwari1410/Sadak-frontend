"use client";

import { Feather } from "@expo/vector-icons";
import Constants from 'expo-constants';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator, // Import ActivityIndicator for loading spinner
} from "react-native";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "expo-router";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";
import { useCamera } from "@/hooks/use-camera";
import * as Location from "expo-location"; // Using expo-location directly

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dc75wqcrf/image/upload";
const UPLOAD_PRESET = "sadaksaathi_preset";

const uploadToCloudinary = async (uri: string): Promise<string> => {
  const formData = new FormData();
  formData.append(
    "file",
    { uri, type: "image/jpeg", name: "upload.jpg" } as any
  );
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.secure_url) {
    return data.secure_url; // hosted URL
  } else {
    throw new Error("Image upload failed: " + JSON.stringify(data));
  }
};

interface ReportData {
  photos: string[];
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  category: string;
  severity: string;
  description: string;
  isAnonymous: boolean;
}

const issueCategories = [
  {
    value: "pothole",
    label: "Pothole",
    icon: "alert-triangle",
    color: "#dc2626",
  },
  {
    value: "waterlogging",
    label: "Waterlogging",
    icon: "cloud-drizzle",
    color: "#2563eb",
  },
  { value: "utility", label: "Utility Repair", icon: "tool", color: "#ea580c" },
  {
    value: "violence",
    label: "Violence/Nuisance",
    icon: "shield",
    color: "#7c3aed",
  },
  { value: "other", label: "Other", icon: "more-horizontal", color: "#6b7280" },
] as const;

const severityLevels = [
  {
    value: "low",
    label: "Low",
    description: "Minor inconvenience",
    color: "#16a34a",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Moderate impact",
    color: "#ca8a04",
  },
  {
    value: "high",
    label: "High",
    description: "Significant problem",
    color: "#ea580c",
  },
  {
    value: "critical",
    label: "Critical",
    description: "Immediate danger",
    color: "#dc2626",
  },
];

export function ReportIssueScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { takePhoto, selectFromGallery, isLoading: cameraLoading } = useCamera();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const [reportData, setReportData] = useState<ReportData>({
    photos: [],
    location: { address: "" },
    category: "",
    severity: "",
    description: "",
    isAnonymous: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalSteps = 4;

  const handlePhotoCapture = () =>
    Alert.alert("Add Photo", "Choose an option", [
      { text: "Camera", onPress: handleTakePhoto },
      { text: "Gallery", onPress: handleSelectPhoto },
      { text: "Cancel", style: "cancel" },
    ]);

  const handleTakePhoto = async () => {
    const photo = await takePhoto();
    if (photo)
      setReportData((p) => ({
        ...p,
        photos: [...p.photos, photo.uri].slice(0, 3),
      }));
  };

  const handleSelectPhoto = async () => {
    const photo = await selectFromGallery();
    if (photo)
      setReportData((p) => ({
        ...p,
        photos: [...p.photos, photo.uri].slice(0, 3),
      }));
  };

  const removePhoto = (index: number) =>
    setReportData((p) => ({
      ...p,
      photos: p.photos.filter((_, i) => i !== index),
    }));

  const handleGetCurrentLocation = async () => {
    setIsFetchingLocation(true);
    setErrors((prev) => {
  const { location, ...rest } = prev; // Destructure to separate 'location'
  return rest; // Return the rest of the errors
});

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied."
      );
      setIsFetchingLocation(false);
      return;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      let addressResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      let address = "Unknown Location";
      if (addressResult.length > 0) {
        const ad = addressResult[0];
        address = `${ad.name || ""} ${ad.street || ""}, ${ad.city || ""}, ${
          ad.postalCode || ""
        }`.trim();
      }

      setReportData((p) => ({ ...p, location: { address, latitude, longitude } }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, location: "Could not fetch location." }));
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (reportData.photos.length === 0)
          newErrors.photos = "Please add at least one photo";
        break;
      case 2:
        if (!reportData.location.address)
          newErrors.location = "Please set a valid location";
        break;
      case 3:
        if (!reportData.category)
          newErrors.category = "Please select a category";
        if (!reportData.severity)
          newErrors.severity = "Please select severity level";
        break;
      case 4:
        if (!reportData.description.trim())
          newErrors.description = "Please provide a description";
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
      else handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  useFocusEffect(
    useCallback(() => {
      setCurrentStep(1);
      setShowSuccess(false);
      setIsSubmitting(false);
      setReportData({
        photos: [],
        location: { address: "" },
        category: "",
        severity: "",
        description: "",
        isAnonymous: false,
      });
      setErrors({});
    }, [])
  );

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const uploadedPhotos: string[] = await Promise.all(
        reportData.photos.map((uri) => uploadToCloudinary(uri))
      );

      const response = await fetch("http://192.168.1.101:8080/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${reportData.category} report`,
          location: reportData.location.address,
          latitude: reportData.location.latitude,
          longitude: reportData.location.longitude,
          status: "Submitted",
          severity: reportData.severity,
          description: reportData.description,
          photos: uploadedPhotos,
          isAnonymous: reportData.isAnonymous,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigation.navigate("index" as never);
      }, 3000);
    } catch (error) {
      setErrors({
        submit: "Failed to submit report. Please try again.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Card style={styles.successCard}>
            <CardContent style={styles.successContent}>
              <View style={styles.successIcon}>
                <Feather name="check-circle" size={32} color="#16a34a" />
              </View>
              <Text style={styles.successTitle}>Report Submitted!</Text>
              <Text style={styles.successDescription}>
                Your report has been submitted successfully.
              </Text>
              <View style={styles.successPoints}>
                <Text style={styles.successPoint}>
                  • You'll receive notifications about updates
                </Text>
                <Text style={styles.successPoint}>
                  • Track progress in "My Reports"
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Add Photos</Text>
              <Text style={styles.stepDescription}>
                Take or upload photos of the issue
              </Text>
            </View>
            {errors.photos && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.photos}</Text>
              </View>
            )}
            <View style={styles.photosGrid}>
              {reportData.photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Feather name="x" size={12} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
              {reportData.photos.length < 3 && (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handlePhotoCapture}
                  disabled={cameraLoading}
                >
                  <Feather name="camera" size={32} color="#9ca3af" />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      case 2:
        const isLocationSet = !!reportData.location.latitude;
        return (
          <View>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Set Location</Text>
              <Text style={styles.stepDescription}>
                Confirm the location of the issue
              </Text>
            </View>
            {errors.location && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.location}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.locationButton,
                isLocationSet && styles.locationButtonSuccess,
              ]}
              onPress={handleGetCurrentLocation}
              disabled={isFetchingLocation}
            >
              {isFetchingLocation ? (
                <ActivityIndicator color="#2563eb" />
              ) : (
                <Feather
                  name={isLocationSet ? "check-circle" : "map-pin"}
                  size={20}
                  color={isLocationSet ? "#ffffff" : "#2563eb"}
                />
              )}
              <Text
                style={[
                  styles.locationButtonText,
                  isLocationSet && { color: "#ffffff" },
                ]}
              >
                {isFetchingLocation
                  ? "Getting Location..."
                  : isLocationSet
                  ? "Location Set!"
                  : "Use Current Location"}
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                textAlign: "center",
                color: "#9ca3af",
                marginVertical: 16,
              }}
            >
              OR
            </Text>

            <View>
              <Text style={styles.label}>Enter Address Manually</Text>
              <TextInput
                placeholder="Enter address or landmark"
                value={reportData.location.address}
                onChangeText={(text) =>
                  setReportData((p) => ({
                    ...p,
                    location: { ...p.location, address: text },
                  }))
                }
                style={styles.locationInput}
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Categorize Issue</Text>
              <Text style={styles.stepDescription}>
                Select the type and severity
              </Text>
            </View>
            {(errors.category || errors.severity) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {errors.category || errors.severity}
                </Text>
              </View>
            )}
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Issue Category</Text>
              <View style={styles.categoryGrid}>
                {issueCategories.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryButton,
                      reportData.category === category.value &&
                        styles.selectedCategory,
                    ]}
                    onPress={() =>
                      setReportData((prev) => ({ ...prev, category: category.value }))
                    }
                  >
                    <Feather
                      name={category.icon}
                      size={20}
                      color={category.color}
                    />
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.severitySection}>
              <Text style={styles.sectionTitle}>Severity Level</Text>
              <View style={styles.severityGrid}>
                {severityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.severityButton,
                      reportData.severity === level.value &&
                        styles.selectedSeverity,
                    ]}
                    onPress={() =>
                      setReportData((prev) => ({ ...prev, severity: level.value }))
                    }
                  >
                    <Badge
                      style={[
                        styles.severityBadge,
                        { backgroundColor: level.color },
                      ]}
                    >
                      <Text style={styles.severityBadgeText}>{level.label}</Text>
                    </Badge>
                    <Text style={styles.severityDescription}>
                      {level.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Add Description</Text>
              <Text style={styles.stepDescription}>
                Provide details about the issue
              </Text>
            </View>
            {errors.description && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.description}</Text>
              </View>
            )}
            <View style={styles.descriptionSection}>
              <Text style={styles.label}>Description</Text>
              <Input
                placeholder="Describe the issue in detail..."
                value={reportData.description}
                onChangeText={(text) =>
                  setReportData((prev) => ({ ...prev, description: text }))
                }
                multiline
                numberOfLines={6}
                style={styles.descriptionInput}
              />
              <Text style={styles.characterCount}>
                {reportData.description.length}/500
              </Text>
            </View>
            <TouchableOpacity
              style={styles.anonymousOption}
              onPress={() =>
                setReportData((prev) => ({
                  ...prev,
                  isAnonymous: !prev.isAnonymous,
                }))
              }
            >
              <View
                style={[
                  styles.checkbox,
                  reportData.isAnonymous && styles.checkedBox,
                ]}
              >
                {reportData.isAnonymous && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.anonymousLabel}>Submit anonymously</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Report New Issue</Text>
            <Text style={styles.headerSubtitle}>
              Step {currentStep} of {totalSteps}
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / totalSteps) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.navButton} onPress={prevStep}>
              <Text style={styles.navButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={nextStep}
            disabled={isSubmitting}
            style={[
              styles.navButton,
              styles.primaryButton,
              currentStep === 1 && { flex: 1 },
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting
                ? "Submitting..."
                : currentStep === totalSteps
                ? "Submit Report"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: "#ffffff",
  paddingTop: Constants.statusBarHeight 
},
  header: { backgroundColor: "#ffffff", paddingTop: 16, paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  headerContent: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { padding: 8, marginRight: 8 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  headerSubtitle: { fontSize: 14, color: "#6b7280" },
  progressBar: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: "#2563eb", borderRadius: 4 },
  contentContainer: { padding: 24, paddingBottom: 16, flexGrow: 1 },
  footer: { paddingVertical: 16, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: "#e5e7eb", backgroundColor: "#ffffff" },
  navigationButtons: { flexDirection: "row", gap: 12 },
  navButton: { flex: 1, paddingVertical: 14, borderRadius: 99, alignItems: "center", backgroundColor: "#e5e7eb" },
  primaryButton: { backgroundColor: "#2563eb" },
  navButtonText: { fontSize: 16, fontWeight: "600", color: "#374151" },
  primaryButtonText: { fontSize: 16, fontWeight: "600", color: "#ffffff" },
  stepHeader: { alignItems: "center", marginBottom: 24 },
  stepTitle: { fontSize: 22, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  stepDescription: { fontSize: 16, color: "#6b7280", textAlign: "center" },
  errorContainer: { backgroundColor: "#fef2f2", padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: "#dc2626", fontSize: 14 },
  photosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16, justifyContent: 'center' },
  photoContainer: { position: "relative", width: 100, height: 100 },
  photo: { width: 100, height: 100, borderRadius: 8 },
  removePhotoButton: { position: "absolute", top: -8, right: -8, width: 24, height: 24, backgroundColor: "#dc2626", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  addPhotoButton: { width: 100, height: 100, borderWidth: 2, borderColor: "#d1d5db", borderStyle: "dashed", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  addPhotoText: { fontSize: 12, color: "#6b7280", marginTop: 8 },
  photoActions: { flexDirection: "row", gap: 16, justifyContent: 'center', marginTop: 16 },
  photoActionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#f3f4f6", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, gap: 8 },
  photoActionText: { fontSize: 14, color: "#374151", fontWeight: "500" },
  locationInfo: { gap: 16 },
  locationButton: { flexDirection: "row", alignItems: "center", justifyContent: 'center', backgroundColor: "#eff6ff", padding: 14, borderRadius: 8, gap: 8 },
  locationButtonText: { fontSize: 16, color: "#2563eb", fontWeight: "600" },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 4 },
  locationInput: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: "white" },
  categorySection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 16 },
  categoryGrid: { gap: 12 },
  categoryButton: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12 },
  selectedCategory: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  categoryLabel: { fontSize: 16, fontWeight: "500", color: "#111827" },
  severitySection: { marginBottom: 24 },
  severityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  severityButton: { flex: 1, minWidth: "48%", padding: 12, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12 },
  selectedSeverity: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  severityBadge: { alignSelf: "flex-start", marginBottom: 8 },
  severityBadgeText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },
  severityDescription: { fontSize: 14, color: "#6b7280" },
  descriptionSection: { marginBottom: 16 },
  descriptionInput: { height: 120, textAlignVertical: "top", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, fontSize: 16 },
  characterCount: { fontSize: 12, color: "#6b7280", textAlign: "right", marginTop: 4 },
  anonymousOption: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: "#d1d5db", borderRadius: 4, alignItems: "center", justifyContent: "center" },
  checkedBox: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  checkmark: { color: "#ffffff", fontSize: 12, fontWeight: "bold" },
  anonymousLabel: { fontSize: 14, color: "#374151" },
  summaryCard: { backgroundColor: "#f9fafb", borderRadius: 12 },
  summaryContent: { padding: 16 },
  summaryTitle: { fontSize: 14, fontWeight: "600", color: "#111827", marginBottom: 12 },
  summaryItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: "#6b7280" },
  summaryValue: { fontSize: 14, color: "#111827", textTransform: "capitalize" },
  locationSummary: { flex: 1, textAlign: "right", marginLeft: 16 },
  locationButtonSuccess: {
  backgroundColor: '#16a34a',
},
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  successCard: { width: "100%", maxWidth: 400 },
  successContent: { padding: 32, alignItems: "center" },
  successIcon: { width: 64, height: 64, backgroundColor: "#dcfce7", borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  successDescription: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 16 },
  successPoints: { gap: 8, alignSelf: 'flex-start' },
  successPoint: { fontSize: 14, color: "#6b7280" },
});