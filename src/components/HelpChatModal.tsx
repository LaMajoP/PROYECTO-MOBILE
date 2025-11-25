import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const SYSTEM_PROMPT = `
Eres el asistente oficial de GlobalLocker Marketplace, una app para comprar productos internacionales usando casilleros recomendados automáticamente según costo y tiempo.

Tu función es ayudar al usuario con:
- dudas sobre la app y cómo navegarla,
- uso de casilleros,
- cómo funciona el marketplace global,
- carrito, wallet, historial y perfil,
- explicar pantallas,
- aclarar que todo es simulado (no hay pagos reales).

Reglas:
- No inventes funciones que la app no tenga.
- No des consejos legales, financieros ni médicos.
- Responde solo sobre el uso de la app.
- Mantén respuestas cortas, claras y amables.
- Usa emojis de forma moderada.
- Siempre responde en español.

Información clave:
- La app sugiere el casillero más económico o rápido.
- Compras, pagos y envíos son simulados.
- Pantallas principales: Home, Details, Cart, Wallet, Profile.
- Wallet muestra balance y movimientos simulados.
- Cart permite ver items y hacer checkout simulado.
- Profile incluye datos del usuario y un botón “Get help”.
`;

type HelpChatModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function HelpChatModal({ visible, onClose }: HelpChatModalProps) {
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  /* --------------------- LOG VISIBILIDAD --------------------- */
  useEffect(() => {
    console.log("📌 HelpChatModal visible:", visible);

    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      console.log("📌 Modal animado y abierto.");
    } else {
      slideAnim.setValue(0);
      setMessages([]);
      console.log("📌 Modal cerrado y mensajes limpiados.");
    }
  }, [visible]);

  /* --------------------- ENVÍO DE MENSAJE --------------------- */
  const sendMessage = async () => {
    if (!input.trim() || loading) {
      console.log("⚠️ No envía mensaje (input vacío o loading en true)");
      return;
    }

    const userMsg = input.trim();
    console.log("✉️ Usuario envía:", userMsg);

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const body = {
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              { text: userMsg },
            ],
          },
        ],
        generationConfig: { responseMimeType: "text/plain" },
      };

      console.log("📤 Enviando request a Gemini:", body);

      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      console.log("🔑 API KEY cargada:", apiKey ? "OK" : "❌ NO DEFINIDA");

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey ?? "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      console.log("📥 Respuesta HTTP status:", response.status);

      const data = await response.json();
      console.log("📄 JSON recibido de la API:", data);

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Lo siento, no pude procesar tu solicitud.";

      console.log("🤖 Texto generado por la IA:", aiText);

      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (e) {
      console.log("❌ ERROR en fetch:", e);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Hubo un error procesando tu mensaje." },
      ]);
    }

    setLoading(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent avoidKeyboard>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Ayuda</Text>

            <TouchableOpacity
              onPress={() => {
                console.log("❌ Modal cerrado por botón.");
                onClose();
              }}
            >
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Chat scroll */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatArea}
            contentContainerStyle={{ padding: 16 }}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((m, i) => (
              <View
                key={i}
                style={[
                  styles.bubble,
                  m.sender === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    m.sender === "user" ? styles.userText : styles.aiText,
                  ]}
                >
                  {m.text}
                </Text>
              </View>
            ))}

            {loading && (
              <View style={[styles.bubble, styles.aiBubble]}>
                <ActivityIndicator color="#1D6FB5" />
              </View>
            )}
          </ScrollView>

          {/* Input row */}
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Escribe tu duda aquí..."
              style={styles.input}
              value={input}
              onChangeText={(t) => {
                console.log("⌨️ Input cambiado:", t);
                setInput(t);
              }}
            />

            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* --------------------- ESTILOS --------------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "70%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#1D6FB5",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  chatArea: {
    flex: 1,
    backgroundColor: "#EFF6FF",
  },
  bubble: {
    padding: 12,
    borderRadius: 14,
    maxWidth: "80%",
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#1D6FB5",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
  },
  bubbleText: {
    fontSize: 15,
  },
  userText: {
    color: "white",
  },
  aiText: {
    color: "#111827",
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#D1D5DB",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  sendBtn: {
    backgroundColor: "#1D6FB5",
    padding: 12,
    borderRadius: 25,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});