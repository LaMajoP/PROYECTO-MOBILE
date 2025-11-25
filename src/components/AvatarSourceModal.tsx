import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AvatarSourceModal = ({ visible, onClose, onTakePhoto, onPickAvatar }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Choose an option</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await onTakePhoto();   // 1️⃣ ABRIR CÁMARA
            }}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onPickAvatar();        // Esto abre los avatares
              onClose();
            }}
          >
            <Text style={styles.buttonText}>Choose Avatar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AvatarSourceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "75%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1D6FB5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  cancel: {
    marginTop: 6,
  },
  cancelText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
});