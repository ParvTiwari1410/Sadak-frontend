import { View, StyleSheet, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Text } from "@/components/ui/text"

export function SplashScreen() {
  return (
    <LinearGradient colors={["#2563eb", "#16a34a"]} style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Text style={styles.logoText}>SS</Text>
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>SadakSaathi</Text>
          <Text style={styles.subtitle}>Your Road. Your Voice.</Text>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 24,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoOuter: {
    width: 96,
    height: 96,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  logoInner: {
    width: 64,
    height: 64,
    backgroundColor: "#ffffff",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 20,
    color: "#ffffff",
    opacity: 0.9,
  },
  loadingContainer: {
    marginTop: 32,
  },
})
