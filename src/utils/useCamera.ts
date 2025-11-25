import * as ImagePicker from "expo-image-picker";

export const openCamera = async () => {
  console.log("📸 [useCamera] Iniciando openCamera()...");

  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  console.log("📸 [useCamera] Permiso:", granted);

  if (!granted) {
    alert("Camera permission is required.");
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.8,
  });

  console.log("📸 [useCamera] Resultado:", result);

  if (result.canceled) {
    console.log("⚠️ [useCamera] Usuario canceló foto");
    return null;
  }

  console.log("📸 [useCamera] URI final:", result.assets?.[0]?.uri);
  return result.assets?.[0]?.uri || null;
};