"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, TextInput } from "react-native"
import { Button } from "@/components/ui/button" // Assuming this Button is a custom component
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";

import { NativeStackScreenProps } from "@react-navigation/native-stack"

type RootTabParamList = {
  Feed: undefined
  Profile: undefined
  home: undefined
}

type Props = NativeStackScreenProps<RootTabParamList, "Profile">

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  city: string
  joinedAt: Date
  avatar?: string
  points: number
  level: number
  badges: string[]
  reportsSubmitted: number
  reportsResolved: number
  communityRank: number
  totalUsers: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
  progress?: number
  target?: number
}

export function ProfileScreen({}: Props) {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTab, setSelectedTab] = useState("profile")

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "1",
    name: "Parv Tiwari", // Changed name to match image
    email: "parvatiwari0714@gmail.com", // Changed email to match image
    phone: "+91 9876543210",
    city: "Gurgaon",
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    points: 150,
    level: 3,
    badges: ["First Reporter", "Community Helper", "Verified Citizen"],
    reportsSubmitted: 8,
    reportsResolved: 5,
    communityRank: 42,
    totalUsers: 1250,
  })

  const [formData, setFormData] = useState<UserProfile>(userProfile);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setUserProfile(formData);
    setIsEditing(false);
  };

  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Reporter",
      description: "Submit your first report",
      icon: "🎯",
      earned: true,
      earnedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Community Helper",
      description: "Validate 10 reports from other users",
      icon: "🤝",
      earned: true,
      earnedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Problem Solver",
      description: "Get 5 reports resolved",
      icon: "✅",
      earned: true,
      earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      title: "Super Contributor",
      description: "Submit 20 reports",
      icon: "⭐",
      earned: false,
      progress: 8,
      target: 20,
    },
    {
      id: "5",
      title: "Community Leader",
      description: "Reach top 10 in city rankings",
      icon: "👑",
      earned: false,
      progress: 42,
      target: 10,
    },
  ])

  const [settings, setSettings] = useState({
    notifications: {
      reportUpdates: true,
      nearbyAlerts: true,
      communityActivity: false,
      weeklyDigest: true,
    },
    privacy: {
      showProfile: true,
      showReports: true,
      allowMessages: false,
    },
    preferences: {
      language: "english",
      theme: "light",
      alertRadius: "2km",
    },
  })

  const tabs = [
    { value: "profile", label: "Profile", icon: "👤" },
    { value: "achievements", label: "Achievements", icon: "🏆" },
    { value: "settings", label: "Settings", icon: "⚙️" },
  ]

  const getLevelProgress = () => {
    const pointsForNextLevel = userProfile.level * 100
    const currentLevelPoints = (userProfile.level - 1) * 100
    // Ensure points are within bounds for percentage calculation
    const pointsInCurrentLevel = userProfile.points - currentLevelPoints;
    const levelRange = pointsForNextLevel - currentLevelPoints;
    const progress = (pointsInCurrentLevel / levelRange) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <CardContent style={styles.profileCardContent}>
          {/* --- RESTRUCTURED: Profile Header Layout --- */}
          <View style={styles.profileHeader}>
            {/* Avatar Section */}
            <View style={styles.profileAvatarContainer}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{userProfile.name[0]}</Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Text style={styles.cameraButtonText}>📷</Text>
              </TouchableOpacity>
            </View>

            {/* Name, Email, Edit Button, Badges Section */}
            <View style={styles.profileHeaderText}>
              <View style={styles.profileNameRow}>
                <View> {/* Group name and email */}
                  <Text style={styles.profileName}>{userProfile.name}</Text>
                  <Text style={styles.profileEmail}>{userProfile.email}</Text>
                </View>
                {/* Edit Button */}
                <TouchableOpacity style={styles.editButton} onPress={() => { setIsEditing(true); setFormData(userProfile); }}>
                  <Text style={styles.editButtonText}>✏️ Edit</Text>
                </TouchableOpacity>
              </View>
              {/* Badges */}
              <View style={styles.profileBadgesContainer}> {/* NEW: Container for badges */}
                <Badge>Level {userProfile.level}</Badge>
                <Badge>{userProfile.points} points</Badge>
              </View>
            </View>
          </View>

          {/* Level Progress */}
          <View style={styles.levelProgress}>
            <View style={styles.levelProgressHeader}>
              <Text style={styles.levelProgressText}>Level {userProfile.level}</Text>
              <Text style={styles.levelProgressText}>Level {userProfile.level + 1}</Text>
            </View>
            <View style={styles.levelProgressBarContainer}>
              <View style={[styles.levelProgressBar, { width: `${getLevelProgress()}%` }]} />
            </View>
            <Text style={styles.levelProgressSubtext}>
              {userProfile.level * 100 - userProfile.points} points to next level
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#3b82f6" }]}>{userProfile.reportsSubmitted}</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#16a34a" }]}>{userProfile.reportsResolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#7c3aed" }]}>#{userProfile.communityRank}</Text>
              <Text style={styles.statLabel}>City Rank</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card style={styles.detailsCard}>
        <CardHeader>
          <Text style={styles.cardTitle}>Profile Information</Text>
        </CardHeader>
        <CardContent style={styles.detailsContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput value={formData.name} onChangeText={(text) => handleInputChange('name', text)} editable={isEditing} style={[styles.input, !isEditing && styles.disabledInput]} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput value={formData.email} onChangeText={(text) => handleInputChange('email', text)} keyboardType="email-address" editable={isEditing} style={[styles.input, !isEditing && styles.disabledInput]} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput value={formData.phone || ""} onChangeText={(text) => handleInputChange('phone', text)} keyboardType="phone-pad" editable={isEditing} style={[styles.input, !isEditing && styles.disabledInput]} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput value={formData.city} onChangeText={(text) => handleInputChange('city', text)} editable={isEditing} style={[styles.input, !isEditing && styles.disabledInput]} />
          </View>

          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                 <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.memberSince}>
            <Text style={styles.memberSinceText}>Member since {formatDate(userProfile.joinedAt)}</Text>
          </View>
        </CardContent>
      </Card>
    </View>
  )

  const renderAchievementsTab = () => (
    <View style={styles.tabContent}>
      {achievements.map((achievement) => (
        <Card key={achievement.id} style={[styles.achievementCard, achievement.earned && styles.earnedAchievementCard]}>
          <CardContent style={styles.achievementContent}>
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>

                {achievement.earned ? (
                  <View style={styles.achievementEarned}>
                    <Badge style={styles.earnedBadge}>🏆 Earned</Badge>
                    {achievement.earnedAt && <Text style={styles.earnedDate}>{formatDate(achievement.earnedAt)}</Text>}
                  </View>
                ) : (
                  <View style={styles.achievementProgress}>
                    {achievement.progress !== undefined && achievement.target && (
                      <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressLabel}>Progress</Text>
                          <Text style={styles.progressNumbers}>
                            {achievement.progress}/{achievement.target}
                          </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              { width: `${(achievement.progress / achievement.target) * 100}%` },
                            ]}
                          />
                        </View>
                      </View>
                    )}
                    <Badge>In Progress</Badge>
                  </View>
                )}
              </View>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  )

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      {/* Notifications */}
      <Card style={styles.settingsCard}>
        <CardHeader>
          <Text style={styles.settingsCardTitle}>🔔 Notifications</Text>
        </CardHeader>
        <CardContent style={styles.settingsContent}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Report Updates</Text>
              <Text style={styles.settingDescription}>Get notified about your report status</Text>
            </View>
            <Switch
              value={settings.notifications.reportUpdates}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, reportUpdates: value },
                }))
              }
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Nearby Alerts</Text>
              <Text style={styles.settingDescription}>Alerts for issues near your location</Text>
            </View>
            <Switch
              value={settings.notifications.nearbyAlerts}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, nearbyAlerts: value },
                }))
              }
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Community Activity</Text>
              <Text style={styles.settingDescription}>Updates from community discussions</Text>
            </View>
            <Switch
              value={settings.notifications.communityActivity}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, communityActivity: value },
                }))
              }
            />
          </View>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card style={styles.settingsCard}>
        <CardHeader>
          <Text style={styles.settingsCardTitle}>🌐 Preferences</Text>
        </CardHeader>
        <CardContent style={styles.settingsContent}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Switch to dark theme</Text>
            </View>
            <Switch />
          </View>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card style={styles.settingsCard}>
        <CardHeader>
          <Text style={styles.settingsCardTitle}>🛡️ Privacy</Text>
        </CardHeader>
        <CardContent style={styles.settingsContent}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Public Profile</Text>
              <Text style={styles.settingDescription}>Allow others to see your profile</Text>
            </View>
            <Switch
              value={settings.privacy.showProfile}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  privacy: { ...prev.privacy, showProfile: value },
                }))
              }
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Show My Reports</Text>
              <Text style={styles.settingDescription}>Display your reports publicly</Text>
            </View>
            <Switch
              value={settings.privacy.showReports}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  privacy: { ...prev.privacy, showReports: value },
                }))
              }
            />
          </View>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card style={styles.settingsCard}>
        <CardContent style={styles.logoutContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("home")} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.navigate("home")} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => setSelectedTab(tab.value)}
            style={[styles.tab, selectedTab === tab.value && styles.activeTab]}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, selectedTab === tab.value && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedTab === "profile" && renderProfileTab()}
        {selectedTab === "achievements" && renderAchievementsTab()}
        {selectedTab === "settings" && renderSettingsTab()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#3b82f6",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerSubtitle: {
    color: "#93c5fd",
    fontSize: 14,
  },
  tabsContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  activeTab: {
    borderBottomColor: "#3b82f6",
  },
  tabIcon: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
    gap: 16, // Reduced gap for a slightly more compact look
  },
  profileCard: {
    // Removed marginBottom as gap in tabContent handles it
  },
  profileCardContent: {
    padding: 16, // Adjusted padding for better fit
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically in the center
    gap: 16,
    marginBottom: 20, // Increased spacing below the header
  },
  profileAvatarContainer: {
    position: "relative",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    backgroundColor: "#e5e7eb",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#374151",
  },
  cameraButton: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    backgroundColor: "#3b82f6",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: '#ffffff'
  },
  cameraButtonText: {
    fontSize: 16,
  },
  // --- MODIFIED & NEW STYLES FOR PROFILE HEADER ALIGNMENT ---
  profileHeaderText: {
    flex: 1, // Take up remaining space
    justifyContent: 'space-between', // Push badge container to bottom if needed, or ensure even spacing
    alignSelf: 'stretch', // Allow it to stretch to contain its children
  },
  profileNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Push name/email group to left, edit button to right
    alignItems: 'flex-start', // Align name and email to the top
    marginBottom: 8, // Space between name/email and badges
  },
  // profileInfo removed as it's no longer needed with new structure
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    color: '#1f2937'
  },
  profileEmail: {
    fontSize: 14,
    color: "#6b7280",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eef2ff',
    borderRadius: 99, // Makes it pill-shaped
  },
  editButtonText: {
    color: '#4338ca', // A vibrant blue
    fontWeight: '500'
  },
  profileBadgesContainer: { // NEW container for badges
    flexDirection: "row",
    gap: 8,
    // marginTop: 8 removed, using marginBottom on profileNameRow instead for better flow
  },
  // --- END MODIFIED & NEW STYLES ---

  levelProgress: {
    marginBottom: 24,
  },
  levelProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  levelProgressText: {
    fontSize: 14,
    color: "#374151",
  },
  levelProgressBarContainer: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: 'hidden', // Ensures progress bar doesn't overflow rounded corners
    marginBottom: 4,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  levelProgressSubtext: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: 'right'
  },
  statsGrid: {
    flexDirection: "row",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 8, // Added space between progress bar and stats
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2
  },
  detailsCard: {
    // Removed marginBottom as gap in tabContent handles it
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  detailsContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    height: 40,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    fontSize: 14,
  },
  disabledInput: {
    backgroundColor: "#f9fafb",
    color: '#6b7280' // Make text look disabled too
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#2563eb", // Slightly darker blue for save
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4b5563",
    fontSize: 14,
    fontWeight: "600",
  },
  memberSince: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 8,
  },
  memberSinceText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: 'center'
  },
  achievementCard: {
    // marginBottom: 16, // Managed by tabContent gap
  },
  earnedAchievementCard: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  achievementContent: {
    padding: 16,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  achievementEarned: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  earnedBadge: {
    backgroundColor: "#dcfce7",
  },
  earnedDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  achievementProgress: {
    gap: 8,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  progressNumbers: {
    fontSize: 12,
    color: "#6b7280",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  settingsCard: {
    marginBottom: 24,
  },
  settingsCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  settingsContent: {
    gap: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  logoutContainer: {
    padding: 16,
  },
})
