// services/hazardApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Hazard {
  id: string
  title: string
  description?: string
  severity: "CRITICAL" | "MODERATE" | "MINOR" | string
  hazardType?: string // Made optional to match your backend
  distance: string
  coordinate: { latitude: number; longitude: number }
  color: string
  timestamp: number
  address?: string
  reportedBy?: string
  status: "REPORTED" | "IN_PROGRESS" | "RESOLVED" | string
  location?: string // Your existing location field
  photos?: string[] // Your existing photos field
}

export interface ReportHazardRequest {
  title: string
  description: string
  severity: "CRITICAL" | "MODERATE" | "MINOR" | string
  hazardType?: string // Made optional
  latitude: number
  longitude: number
  address?: string
  imageUrl?: string
  location?: string // Your existing location field
  photos?: string[] // Your existing photos field
}

// UPDATE THIS URL to match your Spring Boot server
const API_BASE_URL = "http://10.189.20.125:8080/api/reports" // Replace with your actual backend URL

class HazardApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Get nearby hazards within radius - UPDATED ENDPOINT
  async getNearbyHazards(latitude: number, longitude: number, radiusKm: number = 2): Promise<Hazard[]> {
    const reports = await this.request<any[]>(
      `/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`
    )
    
    // Convert your backend response to Hazard format
    return reports.map(report => ({
      id: report.id.toString(),
      title: report.title,
      description: report.description,
      severity: report.severity,
      hazardType: this.inferHazardType(report.title, report.description), // Infer from title/description
      distance: report.distance,
      coordinate: {
        latitude: report.latitude,
        longitude: report.longitude
      },
      color: this.getSeverityColor(report.severity),
      timestamp: new Date(report.submittedAt).getTime(),
      address: report.location, // Using your location field as address
      status: report.status,
      location: report.location, // Keep your existing location field
      photos: report.photos || [] // Your existing photos
    }))
  }

  // Report a new hazard - UPDATED TO USE YOUR EXISTING ENDPOINT
  async reportHazard(hazardData: ReportHazardRequest): Promise<Hazard> {
    const reportData = {
      title: hazardData.title,
      description: hazardData.description,
      severity: hazardData.severity,
      location: hazardData.address || hazardData.location || 'Unknown Location',
      latitude: hazardData.latitude,
      longitude: hazardData.longitude,
      photos: hazardData.imageUrl ? [hazardData.imageUrl] : [],
      status: 'REPORTED'
    }

    const report = await this.request<any>('', {
      method: 'POST',
      body: JSON.stringify(reportData),
    })

    return {
      id: report.id.toString(),
      title: report.title,
      description: report.description,
      severity: report.severity,
      hazardType: hazardData.hazardType,
      distance: "0 km",
      coordinate: {
        latitude: report.latitude,
        longitude: report.longitude
      },
      color: this.getSeverityColor(report.severity),
      timestamp: new Date(report.submittedAt).getTime(),
      address: report.location,
      status: report.status,
      location: report.location,
      photos: report.photos || []
    }
  }

  // Get hazard by ID - UPDATED ENDPOINT
  async getHazardById(id: string): Promise<Hazard> {
    const report = await this.request<any>(`/${id}`)
    
    return {
      id: report.id.toString(),
      title: report.title,
      description: report.description,
      severity: report.severity,
      hazardType: this.inferHazardType(report.title, report.description),
      distance: "0 km", // Default since we don't have distance in single report
      coordinate: {
        latitude: report.latitude || 0,
        longitude: report.longitude || 0
      },
      color: this.getSeverityColor(report.severity),
      timestamp: new Date(report.submittedAt).getTime(),
      address: report.location,
      status: report.status,
      location: report.location,
      photos: report.photos || []
    }
  }

  // Get all hazards reported by current user - NOTE: You'll need to implement this in your backend
  async getMyReports(): Promise<Hazard[]> {
    // For now, get all reports and we'll filter by user later
    const allReports = await this.request<any[]>('')
    
    return allReports.map(report => ({
      id: report.id.toString(),
      title: report.title,
      description: report.description,
      severity: report.severity,
      hazardType: this.inferHazardType(report.title, report.description),
      distance: "0 km",
      coordinate: {
        latitude: report.latitude || 0,
        longitude: report.longitude || 0
      },
      color: this.getSeverityColor(report.severity),
      timestamp: new Date(report.submittedAt).getTime(),
      address: report.location,
      status: report.status,
      location: report.location,
      photos: report.photos || []
    }))
  }

  // Update hazard status - UPDATED ENDPOINT
  async updateHazardStatus(id: string, status: "REPORTED" | "IN_PROGRESS" | "RESOLVED" | string): Promise<Hazard> {
    const report = await this.request<any>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(status), // Your backend expects just the status string
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return {
      id: report.id.toString(),
      title: report.title,
      description: report.description,
      severity: report.severity,
      hazardType: this.inferHazardType(report.title, report.description),
      distance: "0 km",
      coordinate: {
        latitude: report.latitude || 0,
        longitude: report.longitude || 0
      },
      color: this.getSeverityColor(report.severity),
      timestamp: new Date(report.submittedAt).getTime(),
      address: report.location,
      status: report.status,
      location: report.location,
      photos: report.photos || []
    }
  }

  // Helper method to infer hazard type from title/description
  private inferHazardType(title: string, description: string): string {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('pothole') || text.includes('pot hole')) return 'POTHOLE';
    if (text.includes('water') || text.includes('flood') || text.includes('logging')) return 'WATERLOGGING';
    if (text.includes('light') || text.includes('streetlight') || text.includes('lamp')) return 'STREETLIGHT';
    if (text.includes('road') || text.includes('damage') || text.includes('broken')) return 'ROAD_DAMAGE';
    
    return 'OTHER';
  }

  private getSeverityColor(severity: string): string {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'red';
      case 'MODERATE': return 'orange';
      case 'MINOR': return 'green';
      default: return 'gray';
    }
  }
}

export const hazardApi = new HazardApiService();

// Fallback service for offline support
class LocalHazardService {
  private readonly LOCAL_STORAGE_KEY = 'sadak_saathi_local_hazards';

  async saveHazardLocally(hazard: Omit<Hazard, 'id'> & { id?: string }): Promise<Hazard> {
    const hazards = await this.getLocalHazards();
    const newHazard: Hazard = {
      ...hazard,
      id: hazard.id || `local_${Date.now()}`,
      timestamp: hazard.timestamp || Date.now(),
    };
    
    hazards.push(newHazard);
    await AsyncStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(hazards));
    return newHazard;
  }

  async getLocalHazards(): Promise<Hazard[]> {
    try {
      const stored = await AsyncStorage.getItem(this.LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local hazards:', error);
      return [];
    }
  }

  async syncLocalHazards(): Promise<void> {
    const localHazards = await this.getLocalHazards();
    
    for (const hazard of localHazards) {
      if (hazard.id.startsWith('local_')) {
        try {
          await hazardApi.reportHazard({
            title: hazard.title,
            description: hazard.description || '',
            severity: hazard.severity,
            hazardType: hazard.hazardType,
            latitude: hazard.coordinate.latitude,
            longitude: hazard.coordinate.longitude,
            address: hazard.address,
            location: hazard.location,
          });
          // Remove from local storage after successful sync
          await this.removeLocalHazard(hazard.id);
        } catch (error) {
          console.error('Failed to sync hazard:', hazard.id, error);
        }
      }
    }
  }

  private async removeLocalHazard(id: string): Promise<void> {
    const hazards = await this.getLocalHazards();
    const filteredHazards = hazards.filter(h => h.id !== id);
    await AsyncStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(filteredHazards));
  }
}

export const localHazardService = new LocalHazardService();