import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../../lib/supabaseClient";

export const uploadAvatar = async (userId: string, localUri: string) => {
  try {
    console.log("📤 Iniciando subida avatar...");
    console.log("📸 URI recibida:", localUri);

    // 1. Leer archivo como base64 usando API legacy
    const fileBinary = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("🧬 Base64 length:", fileBinary.length);

    // 2. Base64 → Uint8Array (tu misma lógica intacta)
    const buffer = Uint8Array.from(
      atob(fileBinary),
      (c) => c.charCodeAt(0)
    );

    const filePath = `${userId}/${Date.now()}.jpg`;
    console.log("📁 Subiendo a ruta:", filePath);

    // 3. Subir a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.log("❌ Error subiendo:", uploadError);
      return null;
    }

    console.log("☁️ Archivo subido correctamente:", filePath);

    // 4. Obtener URL pública
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    console.log("🌍 URL pública generada:", data.publicUrl);

    return data.publicUrl;

  } catch (err) {
    console.log("🔥 ERROR uploadAvatar:", err);
    return null;
  }
};