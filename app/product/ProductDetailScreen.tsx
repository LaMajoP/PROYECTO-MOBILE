import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabaseClient";

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
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [country, setCountry] = useState("Colombia");
  const [selectedLocker, setSelectedLocker] = useState<LockerOption>("fast");
  const [selectingLockers, setSelectingLockers] = useState(false);

  const [lockers, setLockers] = useState({
    fast: null,
    cheap: null,
  });

  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  /* 1. Cargar producto */
  useEffect(() => {
    const loadProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      setProduct(data);
      setTotalPrice(data.total_price);
      setLoadingProduct(false);
    };

    loadProduct();
  }, [id]);

  /* 2. Selección de lockers */
  const fetchLockers = async () => {
    try {
      setSelectingLockers(true);

      const body = {
        contents: [
          {
            parts: [
              {
                text: `
Devuelve SOLO este JSON EXACTO:
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
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      setLockers(parsed);
      setTotalPrice(product.price + parsed.fast.price);
    } catch (err) {
      console.log("🔥 ERROR:", err);
    } finally {
      setSelectingLockers(false);
    }
  };

  /* 3. Cambiar locker */
  const selectLocker = (type: LockerOption) => {
    setSelectedLocker(type);
    setTotalPrice(product.price + lockers[type].price);
  };

  /* 4. Agregar al carrito */
  const addToCart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Debes iniciar sesión.");
        return;
      }

      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);

        alert("Cantidad aumentada en tu carrito");
        return;
      }

      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        unit_price: product.price,
        quantity: 1,
      });

      alert("Producto agregado al carrito");
    } catch (error) {
      console.log("🔥 Error al agregar al carrito:", error);
    }
  };

  if (loadingProduct) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#1D6FB5" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

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

      <ScrollView style={styles.content}>
        <Text style={styles.productTitle}>{product.name}</Text>

        {/* IMAGEN */}
        <View style={styles.imageWrapper}>
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={{ width: 240, height: 240, borderRadius: 20 }}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={40} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* PRECIO */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>${product.price}</Text>
        </View>

        {/* DESCRIPCIÓN */}
        <View>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* SELECTOR PAÍS */}
        <View style={styles.countryCard}>
          <Text style={styles.countryTitle}>Selecciona tu país</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {COUNTRIES.map((c) => (
              <TouchableOpacity
                key={c.name}
                style={[
                  styles.countryChip,
                  country === c.name && styles.countryChipActive,
                ]}
                onPress={() => setCountry(c.name)}
              >
                <Text
                  style={[
                    styles.countryChipText,
                    country === c.name
                      ? { color: "#FFFFFF" }
                      : { color: "#000000" },
                  ]}
                >
                  {c.flag} {c.name}
                </Text>
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

        {/* LOCKERS */}
        {lockers.fast && lockers.cheap && (
          <>
            <View style={styles.lockersCard}>
              <Text style={styles.lockersTitle}>Lockers recomendados</Text>

              <View style={styles.lockersRow}>
                {/* FAST */}
                <TouchableOpacity
                  style={[
                    styles.lockerCol,
                    selectedLocker === "fast" && styles.lockerColSelected,
                  ]}
                  onPress={() => selectLocker("fast")}
                >
                  <Text style={styles.lockerSubtitle}>{lockers.fast.title}</Text>
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
                  onPress={() => selectLocker("cheap")}
                >
                  <Text style={styles.lockerSubtitle}>{lockers.cheap.title}</Text>
                  <Text style={styles.flagText}>{lockers.cheap.flag}</Text>
                  <Text style={styles.lockerDesc}>Located in {lockers.cheap.location}</Text>
                  <Text style={styles.lockerTime}>{lockers.cheap.days}</Text>
                  <Text style={styles.lockerPrice}>${lockers.cheap.price}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* TOTAL FINAL */}
            <View style={styles.totalCard}>
              <Text style={styles.totalText}>Total: ${totalPrice}</Text>
            </View>

            {/* BOTÓN AGREGAR AL CARRITO */}
            <View style={{ marginTop: 20, marginBottom: 40 }}>
              <TouchableOpacity style={styles.addCartButton} onPress={addToCart}>
                <Text style={styles.addCartText}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

/* =====================================================
                        ESTILOS
   ===================================================== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F7FE" },

  header: {
    backgroundColor: "#1D6FB5",
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 26,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },
  headerSubtitle: { marginTop: 6, color: "#DBEAFE", fontSize: 13, textAlign: "center" },

  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 80 },

  productTitle: { fontSize: 26, fontWeight: "800", color: "#111827", textAlign: "center", marginTop: 14, marginBottom: 12 },

  imageWrapper: { alignItems: "center", marginBottom: 18 },
  imagePlaceholder: {
    width: 240, height: 240, borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  priceRow: { flexDirection: "row", justifyContent: "center", marginBottom: 4 },
  priceText: { fontSize: 28, fontWeight: "900", color: "#111827" },

  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 6 },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    color: "#374151",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },

  countryCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  countryTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12, color: "#111827" },
  countryChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    marginRight: 10,
  },
  countryChipActive: {
    backgroundColor: "#1D6FB5",
  },
  countryChipText: {
    fontSize: 14,
    fontWeight: "600",
  },

  primaryButton: {
    backgroundColor: "#1D6FB5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },

  lockersCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  lockersTitle: { fontSize: 19, fontWeight: "700", textAlign: "center", marginBottom: 16 },
  lockersRow: { flexDirection: "row", gap: 14 },

  lockerCol: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  lockerColSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D4ED8",
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  lockerSubtitle: { fontSize: 16, fontWeight: "700", marginBottom: 6, color: "#111827" },
  flagText: { fontSize: 30, marginBottom: 6 },
  lockerDesc: { fontSize: 13, color: "#4B5563" },
  lockerTime: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  lockerPrice: { marginTop: 10, fontSize: 16, fontWeight: "800", color: "#1F2937" },

  totalCard: {
    marginTop: 26,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  /* BOTÓN CARRITO */
  addCartButton: {
    backgroundColor: "#1D6FB5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  addCartText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});