"use client"

import { useState, useEffect } from "react"
import * as Location from "expo-location"
import { Alert } from "react-native"

export interface LocationData {
  latitude: number
  longitude: number
  address?: string
  accuracy?: number
}

export function useLocation() {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required to get your current location and report issues accurately.",
          [{ text: "OK" }],
        )
        return false
      }
      return true
    } catch (error) {
      console.error("Error requesting location permission:", error)
      return false
    }
  }

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const hasPermission = await requestLocationPermission()
      if (!hasPermission) return null

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      })

     const locationData: LocationData = {
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
  accuracy: location.coords.accuracy ?? undefined,
}


      // Get address from coordinates
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })

        if (addresses.length > 0) {
          const address = addresses[0]
          locationData.address = [address.name, address.street, address.city, address.region].filter(Boolean).join(", ")
        }
      } catch (geocodeError) {
        console.warn("Failed to get address:", geocodeError)
        locationData.address = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
      }

      setCurrentLocation(locationData)
      return locationData
    } catch (error) {
      console.error("Error getting location:", error)
      const errorMessage = "Failed to get your location. Please try again or enter manually."
      setError(errorMessage)
      Alert.alert("Location Error", errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      })

      if (addresses.length > 0) {
        const address = addresses[0]
        return [address.name, address.street, address.city, address.region].filter(Boolean).join(", ")
      }
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    } catch (error) {
      console.error("Error getting address:", error)
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    }
  }

  const watchLocation = async (callback: (location: LocationData) => void) => {
    try {
      const hasPermission = await requestLocationPermission()
      if (!hasPermission) return null

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 50,
        },
        async (location) => {
          const address = await getAddressFromCoordinates(location.coords.latitude, location.coords.longitude)

          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            address,
            accuracy: location.coords.accuracy ?? undefined,
          }

          callback(locationData)
        },
      )

      return subscription
    } catch (error) {
      console.error("Error watching location:", error)
      return null
    }
  }

  // Auto-get location on hook initialization
  useEffect(() => {
    getCurrentLocation()
  }, [])

  return {
    currentLocation,
    isLoading,
    error,
    getCurrentLocation,
    getAddressFromCoordinates,
    watchLocation,
    requestLocationPermission,
  }
}
