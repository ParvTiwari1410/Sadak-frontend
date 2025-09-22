"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useNavigation } from 'expo-router';
import { NativeStackScreenProps } from "@react-navigation/native-stack"

type RootStackParamList = {
  Feed: undefined
  Home: undefined
}

type Props = NativeStackScreenProps<RootStackParamList, "Feed">

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: Date
  likes: number
}

interface MapReport {
  id: string
  type: string
  location: { lat: number; lng: number; address: string }
  status: string
  severity: string
  reportedAt: Date
  reportedBy: string
  description: string
  upvotes: number
  downvotes: number
}

interface FeedReport extends MapReport {
  comments: Comment[]
  views: number
  shares: number
  isValidatedByUser?: boolean
  isFlaggedByUser?: boolean
}

const issueTypeConfig = {
  pothole: { icon: "⚠️", color: "#dc2626" },
  waterlogging: { icon: "💧", color: "#2563eb" },
  utility: { icon: "🔧", color: "#ea580c" },
  violence: { icon: "🛡️", color: "#7c3aed" },
  other: { icon: "➖", color: "#6b7280" },
}

export function CommunityFeedScreen(){
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const [reports, setReports] = useState<FeedReport[]>([
    {
      id: "1",
      type: "pothole",
      location: { lat: 28.4595, lng: 77.0266, address: "MG Road, Sector 14" },
      status: "pending",
      severity: "high",
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reportedBy: "Rajesh Kumar",
      description: "Large pothole causing traffic issues and vehicle damage. Multiple cars have been affected.",
      upvotes: 12,
      downvotes: 1,
      views: 45,
      shares: 3,
      comments: [
        {
          id: "c1",
          userId: "u1",
          userName: "Priya Sharma",
          content: "I saw this yesterday too. Very dangerous for two-wheelers.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 5,
        },
      ],
    },
    {
      id: "2",
      type: "waterlogging",
      location: { lat: 28.46, lng: 77.027, address: "City Center Mall" },
      status: "verified",
      severity: "critical",
      reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      reportedBy: "Anonymous",
      description: "Severe waterlogging blocking main road. Water level is knee-deep.",
      upvotes: 25,
      downvotes: 0,
      views: 120,
      shares: 8,
      comments: [
        {
          id: "c2",
          userId: "u2",
          userName: "Municipal Officer",
          content: "Team has been dispatched. Expected resolution in 2-3 hours.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          likes: 15,
        },
        {
          id: "c3",
          userId: "u3",
          userName: "Local Resident",
          content: "This happens every monsoon. Need permanent solution.",
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          likes: 8,
        },
      ],
    },
    {
      id: "3",
      type: "violence",
      location: { lat: 28.4585, lng: 77.0275, address: "Bus Stop, Sector 15" },
      status: "pending",
      severity: "critical",
      reportedAt: new Date(Date.now() - 30 * 60 * 1000),
      reportedBy: "Anonymous",
      description: "Harassment reported at bus stop. Women feeling unsafe during evening hours.",
      upvotes: 18,
      downvotes: 2,
      views: 67,
      shares: 12,
      comments: [],
    },
  ])

  const filterOptions = [
    { value: "all", label: "All Reports" },
    { value: "pothole", label: "Potholes" },
    { value: "waterlogging", label: "Waterlogging" },
    { value: "utility", label: "Utility Issues" },
    { value: "violence", label: "Safety Concerns" },
    { value: "other", label: "Other" },
  ]

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "critical", label: "Most Critical" },
    { value: "nearby", label: "Nearby" },
  ]

  const filteredReports = reports
    .filter((report) => {
      const matchesSearch =
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = selectedFilter === "all" || report.type === selectedFilter
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.upvotes - a.upvotes
        case "critical":
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return (
            severityOrder[b.severity as keyof typeof severityOrder] -
            severityOrder[a.severity as keyof typeof severityOrder]
          )
        case "nearby":
          return 0
        default:
          return b.reportedAt.getTime() - a.reportedAt.getTime()
      }
    })

  const handleValidate = (reportId: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              upvotes: report.isValidatedByUser ? report.upvotes - 1 : report.upvotes + 1,
              isValidatedByUser: !report.isValidatedByUser,
            }
          : report,
      ),
    )
  }

  const handleFlag = (reportId: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              downvotes: report.isFlaggedByUser ? report.downvotes - 1 : report.downvotes + 1,
              isFlaggedByUser: !report.isFlaggedByUser,
            }
          : report,
      ),
    )
  }

  const handleAddComment = (reportId: string) => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      content: newComment,
      timestamp: new Date(),
      likes: 0,
    }

    setReports((prev) =>
      prev.map((report) => (report.id === reportId ? { ...report, comments: [...report.comments, comment] } : report)),
    )
    setNewComment("")
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "#dcfce7",
      medium: "#fef3c7",
      high: "#fed7aa",
      critical: "#fecaca",
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  const getSeverityTextColor = (severity: string) => {
    const colors = {
      low: "#166534",
      medium: "#92400e",
      high: "#ea580c",
      critical: "#dc2626",
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "#fef3c7",
      verified: "#dbeafe",
      "in-progress": "#fed7aa",
      resolved: "#dcfce7",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getStatusTextColor = (status: string) => {
    const colors = {
      pending: "#92400e",
      verified: "#1d4ed8",
      "in-progress": "#ea580c",
      resolved: "#166534",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
  <Text style={styles.backButtonText}>←</Text>
</TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Community Feed</Text>
            <Text style={styles.headerSubtitle}>{filteredReports.length} reports</Text>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
            <Text style={styles.filterButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.filterChip, selectedFilter === option.value && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(option.value)}
                >
                  <Text style={[styles.filterChipText, selectedFilter === option.value && styles.filterChipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.filterChip, sortBy === option.value && styles.filterChipActive]}
                  onPress={() => setSortBy(option.value)}
                >
                  <Text style={[styles.filterChipText, sortBy === option.value && styles.filterChipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Feed Content */}
      <ScrollView style={styles.feedContainer} contentContainerStyle={styles.feedContent}>
        {filteredReports.map((report) => {
          const config = issueTypeConfig[report.type as keyof typeof issueTypeConfig]
          const isExpanded = expandedReport === report.id

          return (
            <View key={report.id} style={styles.reportCard}>
              {/* Report Header */}
              <View style={styles.reportHeader}>
                <View style={[styles.reportAvatar, { backgroundColor: config.color + "20" }]}>
                  <Text style={styles.reportAvatarIcon}>{config.icon}</Text>
                </View>

                <View style={styles.reportInfo}>
                  <View style={styles.reportTitleRow}>
                    <Text style={styles.reportAuthor}>
                      {report.reportedBy === "Anonymous" ? "Anonymous User" : report.reportedBy}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: getSeverityColor(report.severity) }]}>
                      <Text style={[styles.badgeText, { color: getSeverityTextColor(report.severity) }]}>
                        {report.severity}
                      </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: getStatusColor(report.status) }]}>
                      <Text style={[styles.badgeText, { color: getStatusTextColor(report.status) }]}>
                        {report.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.reportMeta}>
                    <Text style={styles.reportMetaText}>📍 {report.location.address}</Text>
                    <Text style={styles.reportMetaText}> • ⏰ {formatTimeAgo(report.reportedAt)}</Text>
                  </View>

                  <Text style={styles.reportTitle}>{report.type.replace("_", " ")} Report</Text>
                </View>

                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreButtonText}>⋮</Text>
                </TouchableOpacity>
              </View>

              {/* Report Content */}
              <View style={styles.reportContent}>
                <Text style={styles.reportDescription}>{report.description}</Text>

                {/* Report Image Placeholder */}
                <View style={styles.reportImagePlaceholder}>
                  <Text style={styles.reportImageIcon}>{config.icon}</Text>
                  <Text style={styles.reportImageText}>Report Image</Text>
                </View>

                {/* Engagement Stats */}
                <View style={styles.engagementStats}>
                  <Text style={styles.statText}>👁️ {report.views}</Text>
                  <Text style={styles.statText}>💬 {report.comments.length}</Text>
                  <Text style={styles.statText}>📤 {report.shares}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.validateButton,
                      report.isValidatedByUser && styles.actionButtonActive,
                    ]}
                    onPress={() => handleValidate(report.id)}
                  >
                    <Text style={styles.actionButtonText}>👍 Validate ({report.upvotes})</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.flagButton, report.isFlaggedByUser && styles.flagButtonActive]}
                    onPress={() => handleFlag(report.id)}
                  >
                    <Text style={styles.actionButtonText}>🚩 Flag ({report.downvotes})</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.commentButton}
                    onPress={() => setExpandedReport(isExpanded ? null : report.id)}
                  >
                    <Text style={styles.commentButtonText}>💬</Text>
                  </TouchableOpacity>
                </View>

                {/* Comments Section */}
                {isExpanded && (
                  <View style={styles.commentsSection}>
                    {report.comments.map((comment) => (
                      <View key={comment.id} style={styles.comment}>
                        <View style={styles.commentAvatar}>
                          <Text style={styles.commentAvatarText}>{comment.userName[0]}</Text>
                        </View>
                        <View style={styles.commentContent}>
                          <View style={styles.commentBubble}>
                            <View style={styles.commentHeader}>
                              <Text style={styles.commentAuthor}>{comment.userName}</Text>
                              <Text style={styles.commentTime}>{formatTimeAgo(comment.timestamp)}</Text>
                            </View>
                            <Text style={styles.commentText}>{comment.content}</Text>
                          </View>
                          <View style={styles.commentActions}>
                            <TouchableOpacity style={styles.commentAction}>
                              <Text style={styles.commentActionText}>❤️ {comment.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.commentAction}>
                              <Text style={styles.commentActionText}>Reply</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}

                    {/* Add Comment */}
                    <View style={styles.addComment}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>You</Text>
                      </View>
                      <View style={styles.addCommentContent}>
                        <TextInput
                          style={styles.commentInput}
                          placeholder="Add a comment..."
                          value={newComment}
                          onChangeText={setNewComment}
                          multiline
                        />
                        <TouchableOpacity
                          style={styles.sendButton}
                          onPress={() => handleAddComment(report.id)}
                          disabled={!newComment.trim()}
                        >
                          <Text style={styles.sendButtonText}>📤</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )
        })}

        {filteredReports.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💬</Text>
            <Text style={styles.emptyStateTitle}>No reports found</Text>
            <Text style={styles.emptyStateText}>Try adjusting your search or filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#2563eb",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonText: {
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
  },
  filtersContainer: {
    gap: 12,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterChip: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "white",
  },
  filterChipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#2563eb",
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    padding: 16,
    gap: 16,
  },
  reportCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reportAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reportAvatarIcon: {
    fontSize: 20,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  reportAuthor: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  reportMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reportMetaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textTransform: "capitalize",
  },
  moreButton: {
    padding: 4,
  },
  moreButtonText: {
    fontSize: 16,
    color: "#6b7280",
  },
  reportContent: {
    gap: 12,
  },
  reportDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  reportImagePlaceholder: {
    height: 192,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  reportImageIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  reportImageText: {
    fontSize: 14,
    color: "#6b7280",
  },
  engagementStats: {
    flexDirection: "row",
    gap: 16,
  },
  statText: {
    fontSize: 12,
    color: "#6b7280",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  validateButton: {
    backgroundColor: "white",
  },
  flagButton: {
    backgroundColor: "white",
  },
  actionButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  flagButtonActive: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
  },
  actionButtonText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  commentButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  commentButtonText: {
    fontSize: 16,
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
    gap: 12,
  },
  comment: {
    flexDirection: "row",
    gap: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  commentTime: {
    fontSize: 10,
    color: "#6b7280",
  },
  commentText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 16,
  },
  commentActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  commentAction: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  commentActionText: {
    fontSize: 10,
    color: "#6b7280",
  },
  addComment: {
    flexDirection: "row",
    gap: 8,
  },
  addCommentContent: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    fontSize: 16,
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
    color: "#374151",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
  },
})
