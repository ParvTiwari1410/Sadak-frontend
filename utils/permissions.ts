import { Camera } from "expo-camera"
import * as Location from "expo-location"
import * as ImagePicker from "expo-image-picker"
import { Alert } from "react-native"

export interface PermissionStatus {
  camera: boolean
  location: boolean
  mediaLibrary: boolean
}

export async function checkAllPermissions(): Promise<PermissionStatus> {
  const cameraStatus = await Camera.getCameraPermissionsAsync()
  const locationStatus = await Location.getForegroundPermissionsAsync()
  const mediaLibraryStatus = await ImagePicker.getMediaLibraryPermissionsAsync()

  return {
    camera: cameraStatus.status === "granted",
    location: locationStatus.status === "granted",
    mediaLibrary: mediaLibraryStatus.status === "granted",
  }
}

export async function requestAllPermissions(): Promise<PermissionStatus> {
  const cameraPermission = await Camera.requestCameraPermissionsAsync()
  const locationPermission = await Location.requestForegroundPermissionsAsync()
  const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()

  const permissions = {
    camera: cameraPermission.status === "granted",
    location: locationPermission.status === "granted",
    mediaLibrary: mediaLibraryPermission.status === "granted",
  }

  const deniedPermissions = []
  if (!permissions.camera) deniedPermissions.push("Camera")
  if (!permissions.location) deniedPermissions.push("Location")
  if (!permissions.mediaLibrary) deniedPermissions.push("Photo Library")

  if (deniedPermissions.length > 0) {
    Alert.alert(
      "Permissions Required",
      `The following permissions are required for full app functionality: ${deniedPermissions.join(", ")}. You can enable them in your device settings.`,
      [{ text: "OK" }],
    )
  }

  return permissions
}

export function showPermissionAlert(permissionType: string, reason: string) {
  Alert.alert(`${permissionType} Permission Required`, reason, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Settings",
      onPress: () => {
        console.log("Open device settings")
      },
    },
  ])
}
