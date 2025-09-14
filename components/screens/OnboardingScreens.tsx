"use client"

import { useState } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook

export function OnboardingScreens() {
  const { setOnboardingComplete } = useAuth(); // Get the function from the context
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: "Report Issues Instantly", description: "Spot a pothole or waterlogging? Report it with just a photo and location.", image: "🕳️" },
    { title: "Community Validation", description: "Help verify reports from other citizens to build trust and accuracy.", image: "👥" },
    { title: "Track Resolution", description: "Monitor progress from report to resolution with full transparency.", image: "📊" },
  ];
  
  const handleComplete = () => {
    // This now updates the live state of the app AND saves it to storage.
    setOnboardingComplete(); 
    router.replace('/auth'); // Then, navigate to the auth screen.
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button variant="ghost" onPress={handleComplete}>
          <Text style={styles.skipText}>Skip</Text>
        </Button>
        <View style={styles.indicators}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, index === currentSlide ? styles.activeIndicator : styles.inactiveIndicator]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.emoji}>{slides[currentSlide].image}</Text>
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={prevSlide}
          disabled={currentSlide === 0}
          style={[styles.navButton, currentSlide === 0 && styles.disabledButton]}
        >
          <View style={styles.buttonContent}>
            <Feather name="chevron-left" size={16} color={currentSlide === 0 ? "#9ca3af" : "#374151"} />
            <Text style={[styles.buttonText, currentSlide === 0 && styles.disabledText]}>Back</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={nextSlide} style={styles.navButtonPrimary}>
          <View style={styles.buttonContent}>
            <Text style={styles.primaryButtonText}>{currentSlide === slides.length - 1 ? "Get Started" : "Next"}</Text>
            {currentSlide < slides.length - 1 && <Feather name="chevron-right" size={16} color="#ffffff" />}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  skipText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: '500'
  },
  indicators: {
    flexDirection: "row",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: "#3b82f6",
    width: 24
  },
  inactiveIndicator: {
    backgroundColor: "#e5e7eb",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16
  },
  navButton: {
    padding: 12,
  },
  navButtonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#3b82f6',
    borderRadius: 99
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#9ca3af",
  },
});