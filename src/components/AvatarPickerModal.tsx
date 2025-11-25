import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

const STYLES = [
  "adventurer",
  "avataaars",
  "big-smile",
  "bottts",
  "croodles",
  "fun-emoji",
  "lorelei",
  "pixel-art",
];

// Paleta pastel suave
const COLS = ["b6d8ff", "dbeafe", "e0f2fe", "e5ecff", "c7d2fe", "fce7f3"];

export default function AvatarPickerModal({ visible, onClose, onSelect }) {
  const [avatars, setAvatars] = useState<string[]>([]);

  const generateAvatars = () => {
    const list = [];
    for (let i = 0; i < 8; i++) {
      const style = STYLES[Math.floor(Math.random() * STYLES.length)];
      const bg = COLS[Math.floor(Math.random() * COLS.length)];

      const seed = Math.random().toString(36).substring(2, 10);

      const url = `https://api.dicebear.com/8.x/${style}/png?seed=${seed}&backgroundColor=${bg}`;

      list.push(url);
    }
    setAvatars(list);
  };

  useEffect(() => {
    if (visible) generateAvatars();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Selecciona tu avatar</Text>

          <ScrollView contentContainerStyle={styles.grid}>
            {avatars.map((url) => (
              <TouchableOpacity
                key={url}
                style={styles.avatarWrapper}
                onPress={() => {
                  console.log("🎨 Avatar elegido:", url);
                  onSelect(url); // <-- ESTA ES LA LÍNEA CORRECTA
                }}
              >
                <Image source={{ uri: url }} style={styles.avatarImg} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#1D4ED8",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    paddingBottom: 10,
  },
  avatarWrapper: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  avatarImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#1D6FB5",
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
});