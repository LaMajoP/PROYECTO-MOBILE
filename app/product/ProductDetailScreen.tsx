import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";

type LockerOption = "fast" | "cheap";

const renderStars = (rating: number) => {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return full + empty;
};

const COUNTRIES = [
  { flag: "🇨🇴", name: "Colombia" },
  { flag: "🇲🇽", name: "México" },
  { flag: "🇧🇷", name: "Brasil" },
  { flag: "🇺🇸", name: "Estados Unidos" },
  { flag: "🇨🇱", name: "Chile" },
  { flag: "🇵🇪", name: "Perú" },
  { flag: "🇦🇷", name: "Argentina" },
  { flag: "🇪🇸", name: "España" },
  { flag: "🇫🇷", name: "Francia" },
  { flag: "🇯🇵", name: "Japón" },
];

const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const { name, price, rating } = useLocalSearchParams();

  const ratingNum = parseInt(rating || "0", 10);

  const [country, setCountry] = useState("Colombia");
  const [selectedLocker, setSelectedLocker] = useState<LockerOption>("fast");
  const [selectingLockers, setSelectingLockers] = useState(false);

  const [lockers, setLockers] = useState({
    fast: null,
    cheap: null,
  });

  /* ===========================
        FUNCIÓN GEMINI
     =========================== */
  const fetchLockers = async () => {
    try {
      setSelectingLockers(true);

      const body = {
        contents: [
          {
            parts: [
              {
                text: `
Eres un sistema que recomienda lockers internacionales basados en el país destino.

Devuelve SOLO un JSON EXACTO con la siguiente estructura, sin texto adicional, sin comentarios, sin markdown:

{
  "fast": {
    "title": "Faster delivery",
    "flag": "🇧🇷",
    "location": "São Paulo",
    "days": "7–12 days",
    "price": 12.99
  },
  "cheap": {
    "title": "Lower cost",
    "flag": "🇲🇽",
    "location": "Cancún",
    "days": "10–18 days",
    "price": 7.5
  }
}

País destino: ${country}
                `,
              },
            ],
          },
        ],
      };

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      console.log("🔥 RAW:", JSON.stringify(data, null, 2));
      console.log("🔥 API KEY:", process.env.EXPO_PUBLIC_GEMINI_API_KEY);

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      console.log("🔥 RAW TEXT:", text);

      // Quitar ```json y ```
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      setLockers({
        fast: parsed.fast,
        cheap: parsed.cheap,
      });
    } catch (err) {
      console.log("🔥 ERROR:", err);
    } finally {
      setSelectingLockers(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.headerSubtitle}>1 item</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.productTitle}>{name}</Text>

        {/* IMAGEN */}
        <View style={styles.imageWrapper}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#9CA3AF" />
          </View>
        </View>

        {/* PRECIO */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>${price}</Text>
        </View>

        {/* RATING */}
        <View style={styles.ratingRow}>
          <Text style={styles.starsText}>{renderStars(ratingNum)}</Text>
          <Text style={styles.reviewsCount}>(48 reviews)</Text>
        </View>

        {/* DESCRIPCIÓN */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </View>

        {/* SELECTOR PAÍS */}
        <View style={styles.countryCard}>
          <Text style={styles.countryTitle}>Selecciona tu país</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {COUNTRIES.map((c) => (
              <TouchableOpacity
                key={c.name}
                style={[styles.countryChip, country === c.name && styles.countryChipActive]}
                onPress={() => setCountry(c.name)}
              >
                <Text style={styles.countryChipText}>{c.flag} {c.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.primaryButton} onPress={fetchLockers}>
            <Text style={styles.primaryButtonText}>Seleccionar país</Text>
          </TouchableOpacity>

          {selectingLockers && (
            <ActivityIndicator size="small" color="#1D6FB5" style={{ marginTop: 10 }} />
          )}
        </View>

        {/* LOCKERS DINÁMICOS */}
        {lockers.fast && lockers.cheap && (
          <View style={styles.lockersCard}>
            <Text style={styles.lockersTitle}>Lockers recomendados</Text>

            <View style={styles.lockersRow}>
              {/* FAST */}
              <TouchableOpacity
                style={[
                  styles.lockerCol,
                  selectedLocker === "fast" && styles.lockerColSelected,
                ]}
                onPress={() => setSelectedLocker("fast")}
              >
                <View style={styles.lockerHeaderRow}>
                  <Text style={styles.lockerSubtitle}>{lockers.fast.title}</Text>
                  {selectedLocker === "fast" && (
                    <Ionicons name="checkmark-circle" size={18} color="#1D4ED8" />
                  )}
                </View>

                <Text style={styles.flagText}>{lockers.fast.flag}</Text>
                <Text style={styles.lockerDesc}>Located in {lockers.fast.location}</Text>
                <Text style={styles.lockerTime}>{lockers.fast.days}</Text>
                <Text style={styles.lockerPrice}>${lockers.fast.price}</Text>
              </TouchableOpacity>

              {/* CHEAP */}
              <TouchableOpacity
                style={[
                  styles.lockerCol,
                  selectedLocker === "cheap" && styles.lockerColSelected,
                ]}
                onPress={() => setSelectedLocker("cheap")}
              >
                <View style={styles.lockerHeaderRow}>
                  <Text style={styles.lockerSubtitle}>{lockers.cheap.title}</Text>
                  {selectedLocker === "cheap" && (
                    <Ionicons name="checkmark-circle" size={18} color="#1D4ED8" />
                  )}
                </View>

                <Text style={styles.flagText}>{lockers.cheap.flag}</Text>
                <Text style={styles.lockerDesc}>Located in {lockers.cheap.location}</Text>
                <Text style={styles.lockerTime}>{lockers.cheap.days}</Text>
                <Text style={styles.lockerPrice}>${lockers.cheap.price}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* REVIEWS */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Reviews</Text>

          <View style={styles.reviewRow}>
            <Text style={styles.starsText}>{renderStars(3)}</Text>
            <Text style={styles.reviewName}> Emma Myers</Text>
          </View>

          <View style={styles.reviewRow}>
            <Text style={styles.starsText}>{renderStars(5)}</Text>
            <Text style={styles.reviewName}> Benito Perez</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

/* ===== ESTILOS ===== */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E5ECFF" },
  header: {
    backgroundColor: "#1D6FB5",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },
  headerSubtitle: { marginTop: 4, color: "#DBEAFE", fontSize: 13, textAlign: "center" },
  content: { flex: 1 },

  productTitle: { fontSize: 22, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 12 },
  imageWrapper: { alignItems: "center", marginBottom: 16 },
  imagePlaceholder: {
    width: 220, height: 220, borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  priceRow: { flexDirection: "row", alignItems: "center" },
  priceText: { fontSize: 22, fontWeight: "800", color: "#111827" },

  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  starsText: { fontSize: 16, color: "#F59E0B" },
  reviewsCount: { marginLeft: 8, fontSize: 14, color: "#4B5563" },

  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 6 },
  descriptionText: { fontSize: 14, color: "#4B5563", lineHeight: 20 },

  /* País */
  countryCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  countryTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#111827" },
  countryChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  countryChipActive: { backgroundColor: "#1D6FB5" },
  countryChipText: { color: "#111827", fontWeight: "600" },
  primaryButton: {
    backgroundColor: "#1D6FB5",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "700" },

  /* Lockers */
  lockersCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  lockersTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  lockersRow: { flexDirection: "row" },
  lockerCol: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  lockerColSelected: { backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#1D4ED8" },
  lockerHeaderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  lockerSubtitle: { fontSize: 15, fontWeight: "600" },
  flagText: { fontSize: 26, marginBottom: 4 },
  lockerDesc: { fontSize: 13, color: "#4B5563" },
  lockerTime: { fontSize: 13, color: "#4B5563" },
  lockerPrice: { marginTop: 6, fontSize: 14, fontWeight: "700", color: "#111827" },

  /* Reviews */
  reviewRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  reviewName: { fontSize: 14, color: "#111827", marginLeft: 8 },
});