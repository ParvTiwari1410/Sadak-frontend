"use client"
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  city?: string;
  general?: string;
}

export function AuthScreen() {
  const { signIn } = useAuth(); // Get the signIn function from the global context
  const [isLogin, setIsLogin] = useState(true);
  const [userRole, setUserRole] = useState<"citizen" | "authority">("citizen");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!formData.city) newErrors.city = "City is required";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const endpoint = isLogin ? 'login' : 'signup';
  const url = `http://10.250.27.125:8080/api/auth/${endpoint}`;

    const body = isLogin
      ? JSON.stringify({ email: formData.email, password: formData.password })
      : JSON.stringify(formData);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ general: result.message || "Authentication failed. Please try again." });
      } else {
        // SUCCESS: Use the global signIn function to update state and navigate
        signIn(result);
      }
    } catch (error) {
      setErrors({ general: "Cannot connect to the server. Check your internet connection." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Success", "Password reset link sent to your email!");
      setShowForgotPassword(false);
    } catch (error) {
      Alert.alert("Error", "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
          {errors.general && <View style={styles.errorContainer}><Text style={styles.errorText}>{errors.general}</Text></View>}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, errors.email ? styles.inputError : undefined]} placeholder="Enter your email" value={formData.email} onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))} keyboardType="email-address" autoCapitalize="none" />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => setShowForgotPassword(false)}><Text style={styles.buttonOutlineText}>Back</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleForgotPassword} disabled={isLoading}>
              {isLoading && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
              <Text style={styles.buttonPrimaryText}>Send Reset Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.title}>SadakSaathi</Text>
        <Text style={styles.subtitle}>Your Road. Your Voice.</Text>
        {errors.general && <View style={styles.errorContainer}><Text style={styles.errorText}>{errors.general}</Text></View>}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, isLogin && styles.tabActive]} onPress={() => setIsLogin(true)}><Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Login</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tab, !isLogin && styles.tabActive]} onPress={() => setIsLogin(false)}><Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text></TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          {!isLogin && (<View style={styles.inputContainer}><Text style={styles.label}>Full Name</Text><TextInput style={[styles.input, errors.name ? styles.inputError : undefined]} placeholder="Enter your full name" value={formData.name} onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))} />{errors.name && <Text style={styles.errorText}>{errors.name}</Text>}</View>)}
          <View style={styles.inputContainer}><Text style={styles.label}>Email</Text><TextInput style={[styles.input, errors.email ? styles.inputError : undefined]} placeholder="Enter your email" value={formData.email} onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))} keyboardType="email-address" autoCapitalize="none" />{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}</View>
          {!isLogin && (<View style={styles.inputContainer}><Text style={styles.label}>Phone Number</Text><TextInput style={[styles.input, errors.phone ? styles.inputError : undefined]} placeholder="Enter your phone number" value={formData.phone} onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))} keyboardType="phone-pad" />{errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}</View>)}
          {!isLogin && (<View style={styles.inputContainer}><Text style={styles.label}>City/Ward</Text><View style={styles.pickerContainer}><Picker selectedValue={formData.city} onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))} style={styles.picker}><Picker.Item label="Select your city" value="" /><Picker.Item label="Mumbai" value="mumbai" /><Picker.Item label="Delhi" value="delhi" /><Picker.Item label="Bangalore" value="bangalore" /><Picker.Item label="Pune" value="pune" /><Picker.Item label="Gurgaon" value="gurgaon" /><Picker.Item label="Noida" value="noida" /></Picker></View>{errors.city && <Text style={styles.errorText}>{errors.city}</Text>}</View>)}
          <View style={styles.inputContainer}><Text style={styles.label}>Password</Text><View style={styles.passwordContainer}><TextInput style={[styles.passwordInput, errors.password ? styles.inputError : undefined]} placeholder={isLogin ? "Enter your password" : "Create a password"} value={formData.password} onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))} secureTextEntry={!showPassword} /><TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}><Text style={styles.passwordToggleText}>{showPassword ? "Hide" : "Show"}</Text></TouchableOpacity></View>{errors.password && <Text style={styles.errorText}>{errors.password}</Text>}</View>
          {isLogin && (<View style={styles.inputContainer}><Text style={styles.label}>Login as</Text><View style={styles.pickerContainer}><Picker selectedValue={userRole} onValueChange={(value: "citizen" | "authority") => setUserRole(value)} style={styles.picker}><Picker.Item label="Citizen" value="citizen" /><Picker.Item label="Authority" value="authority" /></Picker></View></View>)}
          <TouchableOpacity style={[styles.button, styles.buttonPrimary, styles.submitButton]} onPress={handleSubmit} disabled={isLoading}>{isLoading && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}<Text style={styles.buttonPrimaryText}>{isLogin ? "Login" : "Sign Up"}</Text></TouchableOpacity>
          {isLogin && (<TouchableOpacity onPress={() => setShowForgotPassword(true)}><Text style={styles.linkText}>Forgot Password?</Text></TouchableOpacity>)}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f9ff" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 16 },
  card: { backgroundColor: "white", borderRadius: 12, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  title: { fontSize: 24, fontWeight: "bold", color: "#2563eb", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 24 },
  errorContainer: { backgroundColor: "#fef2f2", borderColor: "#fecaca", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { color: "#dc2626", fontSize: 14 },
  tabContainer: { flexDirection: "row", backgroundColor: "#f3f4f6", borderRadius: 8, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 8 },
  tabActive: { backgroundColor: "white", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 16, color: "#6b7280" },
  tabTextActive: { color: "#2563eb", fontWeight: "600" },
  formContainer: { gap: 16 },
  inputContainer: { gap: 8 },
  label: { fontSize: 16, fontWeight: "500", color: "#374151" },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: "white" },
  inputError: { borderColor: "#dc2626" },
  passwordContainer: { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: "white" },
  passwordToggle: { position: "absolute", right: 12, paddingVertical: 4 },
  passwordToggleText: { color: "#2563eb", fontSize: 14 },
  pickerContainer: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, backgroundColor: "white" },
  picker: { height: 50 },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  buttonPrimary: { backgroundColor: "#2563eb" },
  buttonPrimaryText: { color: "white", fontSize: 16, fontWeight: "600" },
  buttonOutline: { borderWidth: 1, borderColor: "#d1d5db", backgroundColor: "white" },
  buttonOutlineText: { color: "#374151", fontSize: 16, fontWeight: "600" },
  submitButton: { marginTop: 8 },
  buttonRow: { flexDirection: "row", gap: 12 },
  linkText: { color: "#2563eb", fontSize: 14, textAlign: "center", marginTop: 8 },
});