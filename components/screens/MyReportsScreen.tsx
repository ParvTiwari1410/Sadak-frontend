"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { NativeStackScreenProps } from "@react-navigation/native-stack"

type RootStackParamList = {
  Home: undefined
  MyReports: undefined
  Report: undefined
}

type Props = NativeStackScreenProps<RootStackParamList, "MyReports">


interface UserReport {
  id: string
  type: "pothole" | "waterlogging" | "utility" | "violence" | "other"
  title: string
  description: string
  location: {
    address: string
    lat: number
    lng: number
  }
  status: "submitted" | "verified" | "assigned" | "in-progress" | "resolved" | "rejected"
  severity: "low" | "medium" | "high" | "critical"
  submittedAt: Date
  lastUpdated: Date
  images: string[]
  upvotes: number
  comments: number
  views: number
  assignedTo?: string
  resolutionDetails?: string
  pointsEarned: number
}

export function MyReportsScreen({ navigation }: Props) {
  const [selectedTab, setSelectedTab] = useState("all")

  const [userReports] = useState<UserReport[]>([
    {
      id: "1",
      type: "pothole",
      title: "Large Pothole on MG Road",
      description: "Deep pothole causing vehicle damage near the traffic signal",
      location: { address: "MG Road, Sector 14", lat: 28.4595, lng: 77.0266 },
      status: "resolved",
      severity: "high",
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      images: ["/placeholder.svg?height=200&width=300"],
      upvotes: 15,
      comments: 8,
      views: 45,
      assignedTo: "Municipal Team A",
      resolutionDetails: "Pothole filled with concrete. Road surface restored.",
      pointsEarned: 25,
    },
    {
      id: "2",
      type: "waterlogging",
      title: "Waterlogging at City Center",
      description: "Severe waterlogging blocking main entrance during monsoon",
      location: { address: "City Center Mall", lat: 28.46, lng: 77.027 },
      status: "in-progress",
      severity: "critical",
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
      images: ["/placeholder.svg?height=200&width=300"],
      upvotes: 32,
      comments: 12,
      views: 89,
      assignedTo: "Drainage Department",
      pointsEarned: 20,
    },
    {
      id: "3",
      type: "utility",
      title: "Broken Street Light",
      description: "Street light not working for past week, creating safety concerns",
      location: { address: "Park Street, Sector 12", lat: 28.459, lng: 77.026 },
      status: "verified",
      severity: "medium",
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      images: ["/placeholder.svg?height=200&width=300"],
      upvotes: 8,
      comments: 3,
      views: 23,
      pointsEarned: 15,
    },
    {
      id: "4",
      type: "other",
      title: "Garbage Accumulation",
      description: "Large pile of garbage not collected for over a week",
      location: { address: "Market Area, Sector 10", lat: 28.4605, lng: 77.0255 },
      status: "submitted",
      severity: "low",
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      images: ["/placeholder.svg?height=200&width=300"],
      upvotes: 3,
      comments: 1,
      views: 12,
      pointsEarned: 0,
    },
  ])

  const statusConfig = {
    submitted: { color: "#d97706", label: "Submitted" },
    verified: { color: "#3b82f6", label: "Verified" },
    assigned: { color: "#7c3aed", label: "Assigned" },
    "in-progress": { color: "#ea580c", label: "In Progress" },
    resolved: { color: "#16a34a", label: "Resolved" },
    rejected: { color: "#dc2626", label: "Rejected" },
  }

  const tabs = [
    { value: "all", label: "All", count: userReports.length },
    {
      value: "active",
      label: "Active",
      count: userReports.filter((r) => !["resolved", "rejected"].includes(r.status)).length,
    },
    { value: "resolved", label: "Resolved", count: userReports.filter((r) => r.status === "resolved").length },
  ]

  const filteredReports = userReports.filter((report) => {
    switch (selectedTab) {
      case "active":
        return !["resolved", "rejected"].includes(report.status)
      case "resolved":
        return report.status === "resolved"
      default:
        return true
    }
  })

  const totalPoints = userReports.reduce((sum, report) => sum + report.pointsEarned, 0)
  const resolvedCount = userReports.filter((r) => r.status === "resolved").length
  const totalUpvotes = userReports.reduce((sum, report) => sum + report.upvotes, 0)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusProgress = (status: string) => {
    const statusOrder = ["submitted", "verified", "assigned", "in-progress", "resolved"]
    const currentIndex = statusOrder.indexOf(status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
       <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>My Reports</Text>
            <Text style={styles.headerSubtitle}>Track your contributions</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{resolvedCount}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalUpvotes}</Text>
            <Text style={styles.statLabel}>Community Votes</Text>
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
            <Text style={[styles.tabText, selectedTab === tab.value && styles.activeTabText]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reports List */}
      <ScrollView style={styles.content}>
        <View style={styles.reportsList}>
          {filteredReports.map((report) => {
            const statusInfo = statusConfig[report.status]

            return (
              <Card key={report.id} style={styles.reportCard}>
                <CardHeader style={styles.reportHeader}>
                  <View style={styles.reportHeaderContent}>
                    <View style={styles.reportInfo}>
                      <View style={styles.reportBadges}>
                        <Badge style={{ backgroundColor: statusInfo.color }}>{statusInfo.label}</Badge>
                        {report.pointsEarned > 0 && (
                          <Badge style={{ backgroundColor: "#d97706" }}>+{report.pointsEarned} pts</Badge>
                        )}
                      </View>
                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <View style={styles.reportMeta}>
                        <Text style={styles.reportMetaText}>📍 {report.location.address}</Text>
                        <Text style={styles.reportMetaText}>📅 {formatDate(report.submittedAt)}</Text>
                      </View>
                    </View>
                    <View style={styles.reportActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={[styles.actionButtonText, { color: "#dc2626" }]}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </CardHeader>

                <CardContent style={styles.reportContent}>
                  <Text style={styles.reportDescription}>{report.description}</Text>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressDate}>Last updated: {formatDate(report.lastUpdated)}</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBar, { width: `${getStatusProgress(report.status)}%` }]} />
                    </View>
                  </View>

                  {/* Assignment Info */}
                  {report.assignedTo && (
                    <View style={styles.assignmentContainer}>
                      <Text style={styles.assignmentText}>📈 Assigned to: {report.assignedTo}</Text>
                    </View>
                  )}

                  {/* Resolution Details */}
                  {report.resolutionDetails && (
                    <View style={styles.resolutionContainer}>
                      <Text style={styles.resolutionTitle}>✅ Resolution Details</Text>
                      <Text style={styles.resolutionText}>{report.resolutionDetails}</Text>
                    </View>
                  )}

                  {/* Engagement Stats */}
                  <View style={styles.engagementStats}>
                    <Text style={styles.engagementStat}>👁️ {report.views} views</Text>
                    <Text style={styles.engagementStat}>👍 {report.upvotes} votes</Text>
                    <Text style={styles.engagementStat}>💬 {report.comments} comments</Text>
                  </View>
                </CardContent>
              </Card>
            )
          })}

          {filteredReports.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📷</Text>
              <Text style={styles.emptyStateTitle}>No reports found</Text>
              <Text style={styles.emptyStateDescription}>Start contributing to your community</Text>
         <Button onPress={() => navigation.navigate("Report")}>📷 Report an Issue</Button>
            </View>
          )}
        </View>
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
    marginBottom: 16,
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
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#93c5fd",
    fontSize: 12,
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
  },
  activeTab: {
    borderBottomColor: "#3b82f6",
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
  reportsList: {
    padding: 16,
    gap: 16,
  },
  reportCard: {
    marginBottom: 16,
  },
  reportHeader: {
    paddingBottom: 12,
  },
  reportHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reportInfo: {
    flex: 1,
    marginRight: 12,
  },
  reportBadges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  reportMeta: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  reportMetaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  reportActions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  actionButtonText: {
    fontSize: 16,
  },
  reportContent: {
    paddingTop: 0,
  },
  reportDescription: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  progressDate: {
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
  assignmentContainer: {
    backgroundColor: "#dbeafe",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  assignmentText: {
    fontSize: 14,
    color: "#1d4ed8",
  },
  resolutionContainer: {
    backgroundColor: "#dcfce7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  resolutionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#166534",
    marginBottom: 4,
  },
  resolutionText: {
    fontSize: 14,
    color: "#15803d",
  },
  engagementStats: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  engagementStat: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
})

