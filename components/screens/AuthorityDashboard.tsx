"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { NativeStackScreenProps } from "@react-navigation/native-stack"

type RootStackParamList = {
  Home: undefined
  Authority: undefined
}

type Props = NativeStackScreenProps<RootStackParamList, "Authority">


interface AuthorityReport {
  id: string
  type: "pothole" | "waterlogging" | "utility" | "violence" | "other"
  title: string
  description: string
  location: {
    address: string
    ward: string
    lat: number
    lng: number
  }
  status: "pending" | "verified" | "assigned" | "in-progress" | "resolved" | "rejected"
  severity: "low" | "medium" | "high" | "critical"
  submittedAt: Date
  lastUpdated: Date
  reportedBy: string
  upvotes: number
  assignedTo?: string
  estimatedResolution?: Date
  actualResolution?: Date
  resolutionNotes?: string
  priority: number
}

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  activeAssignments: number
  completedThisMonth: number
  rating: number
}

export function AuthorityDashboard({ navigation }: Props) {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedWard, setSelectedWard] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<AuthorityReport | null>(null)

  const [reports] = useState<AuthorityReport[]>([
    {
      id: "1",
      type: "pothole",
      title: "Large Pothole on MG Road",
      description: "Deep pothole causing vehicle damage near traffic signal",
      location: { address: "MG Road, Sector 14", ward: "Ward 12", lat: 28.4595, lng: 77.0266 },
      status: "verified",
      severity: "high",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
      reportedBy: "Rajesh Kumar",
      upvotes: 15,
      priority: 8,
    },
    {
      id: "2",
      type: "waterlogging",
      title: "Severe Waterlogging at City Center",
      description: "Water accumulation blocking main road access",
      location: { address: "City Center Mall", ward: "Ward 15", lat: 28.46, lng: 77.027 },
      status: "in-progress",
      severity: "critical",
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      reportedBy: "Anonymous",
      upvotes: 32,
      assignedTo: "Drainage Team A",
      estimatedResolution: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 10,
    },
    {
      id: "3",
      type: "utility",
      title: "Broken Street Light",
      description: "Non-functional street light creating safety concerns",
      location: { address: "Park Street, Sector 12", ward: "Ward 10", lat: 28.459, lng: 77.026 },
      status: "assigned",
      severity: "medium",
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reportedBy: "Priya Sharma",
      upvotes: 8,
      assignedTo: "Electrical Team B",
      estimatedResolution: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      priority: 6,
    },
  ])

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Ramesh Singh",
      role: "Road Maintenance",
      department: "PWD",
      activeAssignments: 3,
      completedThisMonth: 12,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Drainage Team A",
      role: "Water Management",
      department: "Municipal",
      activeAssignments: 2,
      completedThisMonth: 8,
      rating: 4.6,
    },
    {
      id: "3",
      name: "Electrical Team B",
      role: "Utility Repair",
      department: "Electrical",
      activeAssignments: 4,
      completedThisMonth: 15,
      rating: 4.9,
    },
  ])

  const stats = {
    totalReports: reports.length,
    pendingVerification: reports.filter((r) => r.status === "pending").length,
    inProgress: reports.filter((r) => r.status === "in-progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    critical: reports.filter((r) => r.severity === "critical").length,
    avgResolutionTime: "2.3 days",
    citizenSatisfaction: "87%",
  }

  const filteredReports = reports
    .filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesWard = selectedWard === "all" || report.location.ward === selectedWard
      const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
      return matchesSearch && matchesWard && matchesStatus
    })
    .sort((a, b) => b.priority - a.priority)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "reports", label: "Reports" },
    { value: "team", label: "Team" },
    { value: "analytics", label: "Analytics" },
  ]

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <Text style={styles.statNumber}>{stats.totalReports}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </CardContent>
        </Card>
        <Card style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <Text style={[styles.statNumber, { color: "#d97706" }]}>{stats.pendingVerification}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </CardContent>
        </Card>
        <Card style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <Text style={[styles.statNumber, { color: "#ea580c" }]}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </CardContent>
        </Card>
        <Card style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <Text style={[styles.statNumber, { color: "#16a34a" }]}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </CardContent>
        </Card>
      </View>

      {/* Performance Metrics */}
      <View style={styles.metricsGrid}>
        <Card style={styles.metricCard}>
          <CardHeader>
            <Text style={styles.metricTitle}>Avg Resolution Time</Text>
          </CardHeader>
          <CardContent>
            <Text style={styles.metricValue}>{stats.avgResolutionTime}</Text>
            <Text style={styles.metricChange}>↓ 15% from last month</Text>
          </CardContent>
        </Card>
        <Card style={styles.metricCard}>
          <CardHeader>
            <Text style={styles.metricTitle}>Citizen Satisfaction</Text>
          </CardHeader>
          <CardContent>
            <Text style={styles.metricValue}>{stats.citizenSatisfaction}</Text>
            <Text style={styles.metricChange}>↑ 5% from last month</Text>
          </CardContent>
        </Card>
        <Card style={styles.metricCard}>
          <CardHeader>
            <Text style={styles.metricTitle}>Critical Issues</Text>
          </CardHeader>
          <CardContent>
            <Text style={[styles.metricValue, { color: "#dc2626" }]}>{stats.critical}</Text>
            <Text style={[styles.metricChange, { color: "#dc2626" }]}>Requires immediate attention</Text>
          </CardContent>
        </Card>
      </View>

      {/* Recent Activity */}
      <Card style={styles.activityCard}>
        <CardHeader>
          <Text style={styles.cardTitle}>Recent Activity</Text>
        </CardHeader>
        <CardContent>
          <View style={styles.activityList}>
            {reports.slice(0, 3).map((report) => (
              <View key={report.id} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{report.title}</Text>
                  <Text style={styles.activityLocation}>{report.location.address}</Text>
                </View>
                <Badge>{report.status}</Badge>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </View>
  )

  const renderReportsTab = () => (
    <View style={styles.tabContent}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search reports..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Reports List */}
      <View style={styles.reportsList}>
        {filteredReports.map((report) => (
          <Card key={report.id} style={styles.reportCard}>
            <CardContent style={styles.reportCardContent}>
              <View style={styles.reportHeader}>
                <View style={styles.reportInfo}>
                  <View style={styles.reportBadges}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Badge>{report.severity}</Badge>
                    <Badge>{report.status}</Badge>
                  </View>
                  <View style={styles.reportMeta}>
                    <Text style={styles.reportMetaText}>📍 {report.location.address}</Text>
                    <Text style={styles.reportMetaText}>📅 {formatDate(report.submittedAt)}</Text>
                    <Text style={styles.reportMetaText}>👥 {report.upvotes} votes</Text>
                  </View>
                  <Text style={styles.reportDescription}>{report.description}</Text>
                  {report.assignedTo && (
                    <View style={styles.assignmentInfo}>
                      <Text style={styles.assignmentText}>✅ Assigned to: {report.assignedTo}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.priorityContainer}>
                  <Text style={styles.priorityNumber}>#{report.priority}</Text>
                  <Text style={styles.priorityLabel}>Priority</Text>
                </View>
              </View>

              <View style={styles.reportActions}>
                {report.status === "verified" && (
                  <Button onPress={() => console.log(`Assign report ${report.id}`)}>Assign to Team</Button>
                )}
                {report.status === "assigned" && (
                  <Button onPress={() => console.log(`Mark ${report.id} in progress`)}>Mark In Progress</Button>
                )}
                {report.status === "in-progress" && (
                  <Button onPress={() => setSelectedReport(report)}>Mark Resolved</Button>
                )}
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  )

  const renderTeamTab = () => (
    <View style={styles.tabContent}>
      {teamMembers.map((member) => (
        <Card key={member.id} style={styles.teamCard}>
          <CardContent style={styles.teamCardContent}>
            <View style={styles.teamMemberInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.name[0]}</Text>
              </View>
              <View style={styles.memberDetails}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>
                  {member.role} • {member.department}
                </Text>
                <View style={styles.memberStats}>
                  <Text style={styles.memberStat}>{member.activeAssignments} active assignments</Text>
                  <Text style={styles.memberStat}>{member.completedThisMonth} completed this month</Text>
                  <Text style={styles.memberStat}>⭐ {member.rating}/5.0</Text>
                </View>
              </View>
              <Button>View Details</Button>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  )

  const renderAnalyticsTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.analyticsCard}>
        <CardHeader>
          <Text style={styles.cardTitle}>Issue Heatmap</Text>
        </CardHeader>
        <CardContent>
          <View style={styles.heatmapPlaceholder}>
            <Text style={styles.placeholderText}>📊</Text>
            <Text style={styles.placeholderText}>Interactive heatmap showing</Text>
            <Text style={styles.placeholderText}>recurring problem zones</Text>
          </View>
        </CardContent>
      </Card>

      <View style={styles.analyticsGrid}>
        <Card style={styles.analyticsCard}>
          <CardHeader>
            <Text style={styles.cardTitle}>Issues by Category</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.categoryStats}>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryLabel}>Potholes</Text>
                <Text style={styles.categoryPercent}>45%</Text>
              </View>
              <View style={[styles.progressBar, { width: "45%", backgroundColor: "#ef4444" }]} />

              <View style={styles.categoryItem}>
                <Text style={styles.categoryLabel}>Waterlogging</Text>
                <Text style={styles.categoryPercent}>30%</Text>
              </View>
              <View style={[styles.progressBar, { width: "30%", backgroundColor: "#3b82f6" }]} />

              <View style={styles.categoryItem}>
                <Text style={styles.categoryLabel}>Utility Issues</Text>
                <Text style={styles.categoryPercent}>25%</Text>
              </View>
              <View style={[styles.progressBar, { width: "25%", backgroundColor: "#f97316" }]} />
            </View>
          </CardContent>
        </Card>

        <Card style={styles.analyticsCard}>
          <CardHeader>
            <Text style={styles.cardTitle}>Resolution Trends</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.trendsPlaceholder}>
              <Text style={styles.placeholderText}>📈</Text>
              <Text style={styles.placeholderText}>Resolution time trends</Text>
              <Text style={styles.placeholderText}>and performance metrics</Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>

            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Authority Dashboard</Text>
            <Text style={styles.headerSubtitle}>Municipal Management System</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction}>
              <Text style={styles.headerActionText}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Text style={styles.headerActionText}>⬇️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setSelectedTab(tab.value)}
              style={[styles.tab, selectedTab === tab.value && styles.activeTab]}
            >
              <Text style={[styles.tabText, selectedTab === tab.value && styles.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedTab === "overview" && renderOverviewTab()}
        {selectedTab === "reports" && renderReportsTab()}
        {selectedTab === "team" && renderTeamTab()}
        {selectedTab === "analytics" && renderAnalyticsTab()}
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
    backgroundColor: "#7c3aed",
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
    color: "#c4b5fd",
    fontSize: 14,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerAction: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  headerActionText: {
    color: "#ffffff",
    fontSize: 16,
  },
  tabsContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#7c3aed",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#7c3aed",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
    gap: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
  },
  statCardContent: {
    alignItems: "center",
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  metricsGrid: {
    gap: 16,
  },
  metricCard: {
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    color: "#16a34a",
  },
  activityCard: {
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 12,
    color: "#6b7280",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    paddingLeft: 40,
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    marginBottom: 8,
  },
  reportCardContent: {
    padding: 16,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
    marginRight: 12,
  },
  reportBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  reportMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  reportMetaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  reportDescription: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  assignmentInfo: {
    backgroundColor: "#dbeafe",
    padding: 8,
    borderRadius: 6,
  },
  assignmentText: {
    fontSize: 12,
    color: "#1d4ed8",
  },
  priorityContainer: {
    alignItems: "center",
  },
  priorityNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  priorityLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  reportActions: {
    flexDirection: "row",
    gap: 8,
  },
  teamCard: {
    marginBottom: 12,
  },
  teamCardContent: {
    padding: 16,
  },
  teamMemberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: "#e5e7eb",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  memberStats: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  memberStat: {
    fontSize: 12,
    color: "#6b7280",
  },
  analyticsCard: {
    marginBottom: 16,
  },
  heatmapPlaceholder: {
    height: 192,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  analyticsGrid: {
    gap: 16,
  },
  categoryStats: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryLabel: {
    fontSize: 14,
    color: "#374151",
  },
  categoryPercent: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  trendsPlaceholder: {
    height: 128,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
})
