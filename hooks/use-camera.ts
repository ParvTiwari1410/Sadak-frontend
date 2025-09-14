"use client"

import { useState } from "react"
import * as ImagePicker from "expo-image-picker"
import { Camera } from "expo-camera"
import { Alert } from "react-native"

export interface CameraImage {
  uri: string
  width: number
  height: number
  type?: string
}

export function useCamera() {
  const [isLoading, setIsLoading] = useState(false)

  const requestCameraPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync()
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (cameraPermission.status !== "granted" || mediaLibraryPermission.status !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Camera and photo library permissions are required to take and select photos.",
        [{ text: "OK" }],
      )
      return false
    }
    return true
  }

  const takePhoto = async (): Promise<CameraImage | null> => {
    try {
      setIsLoading(true)

      const hasPermission = await requestCameraPermissions()
      if (!hasPermission) return null

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
        }
      }
      return null
    } catch (error) {
      console.error("Error taking photo:", error)
      Alert.alert("Error", "Failed to take photo. Please try again.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const selectFromGallery = async (): Promise<CameraImage | null> => {
    try {
      setIsLoading(true)

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (permission.status !== "granted") {
        Alert.alert("Permission Required", "Photo library permission is required to select photos.")
        return null
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
        }
      }
      return null
    } catch (error) {
      console.error("Error selecting photo:", error)
      Alert.alert("Error", "Failed to select photo. Please try again.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const showImagePicker = () => {
    Alert.alert(
      "Select Photo",
      "Choose how you want to add a photo",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Gallery", onPress: selectFromGallery },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true },
    )
  }

  return {
    takePhoto,
    selectFromGallery,
    showImagePicker,
    isLoading,
  }
}
