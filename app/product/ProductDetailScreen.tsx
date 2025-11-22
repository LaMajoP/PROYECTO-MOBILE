import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";

type LockerOption = "fast" | "cheap";

const renderStars = (rating: number) => {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return full + empty;
};

const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const { name, price, rating } = useLocalSearchParams<{
    name: string;
    price: string;
    rating: string;
  }>();

  const [selectedLocker, setSelectedLocker] = useState<LockerOption>("fast");

  const ratingNum = parseInt(rating || "0", 10);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER azul */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Product Details</Text>

          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.headerSubtitle}>1 item</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Nombre del producto */}
        <Text style={styles.productTitle}>{name}</Text>

        {/* Imagen */}
        <View style={styles.imageWrapper}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#9CA3AF" />
          </View>
        </View>

        {/* Precio + rating */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>${price}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.starsText}>{renderStars(ratingNum)}</Text>
          <Text style={styles.reviewsCount}>(48 reviews)</Text>
        </View>

        {/* Seller info */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.mutedLabel}>Sale by:</Text>
          <View style={styles.sellerRow}>
            <Text style={styles.sellerName}>Cute Accessories</Text>
            <Text style={styles.sellerStats}>210 sales | 580 sold</Text>
          </View>
        </View>

        {/* Descripción */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Augum
            commodo ligula eget eget dolor. Mauris gravida, magna velvinar at
            ausum, vitae, phon cens a.
          </Text>
        </View>

        {/* LOCKERS seleccionables */}
        <View style={styles.lockersCard}>
          <Text style={styles.lockersTitle}>Lockers</Text>

          <View style={styles.lockersRow}>
            {/* Locker FAST */}
            <TouchableOpacity
              style={[
                styles.lockerCol,
                selectedLocker === "fast" && styles.lockerColSelected,
              ]}
              activeOpacity={0.9}
              onPress={() => setSelectedLocker("fast")}
            >
              <View style={styles.lockerHeaderRow}>
                <Text style={styles.lockerSubtitle}>Faster delivery</Text>
                {selectedLocker === "fast" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#1D4ED8"
                  />
                )}
              </View>
              <Text style={styles.flagText}>🇧🇷</Text>
              <Text style={styles.lockerDesc}>Located in São Paulo</Text>
              <Text style={styles.lockerTime}>7–12 days</Text>
            </TouchableOpacity>

            {/* Locker CHEAP */}
            <TouchableOpacity
              style={[
                styles.lockerCol,
                selectedLocker === "cheap" && styles.lockerColSelected,
              ]}
              activeOpacity={0.9}
              onPress={() => setSelectedLocker("cheap")}
            >
              <View style={styles.lockerHeaderRow}>
                <Text style={styles.lockerSubtitle}>Lower cost</Text>
                {selectedLocker === "cheap" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#1D4ED8"
                  />
                )}
              </View>
              <Text style={styles.flagText}>🇲🇽</Text>
              <Text style={styles.lockerDesc}>Located in Cancun</Text>
              <Text style={styles.lockerTime}>10–18 days</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E5ECFF",
  },
  header: {
    backgroundColor: "#1D6FB5",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    marginTop: 4,
    color: "#DBEAFE",
    fontSize: 13,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 220,
    height: 220,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  starsText: {
    fontSize: 16,
    color: "#F59E0B",
  },
  reviewsCount: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4B5563",
  },
  mutedLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },
  sellerName: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  sellerStats: {
    fontSize: 13,
    color: "#4B5563",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },

  // LOCKERS
  lockersCard: {
    marginTop: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  lockersTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#111827",
  },
  lockersRow: {
    flexDirection: "row",
  },
  lockerCol: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  lockerColSelected: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#1D4ED8",
  },
  lockerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  lockerSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  flagText: {
    fontSize: 26,
    marginBottom: 4,
  },
  lockerDesc: {
    fontSize: 13,
    color: "#4B5563",
  },
  lockerTime: {
    fontSize: 13,
    color: "#4B5563",
  },

  // REVIEWS
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  reviewName: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 8,
  },
});