import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Product = {
  id: string;
  name: string;
  price: string;
  rating: number; // 1 a 5
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS = ["Electronics", "Home", "Beauty & Health"];

const PRODUCTS: Product[] = [
  { id: "1", name: "Cute Lamp", price: "19.118", rating: 2 },
  { id: "2", name: "Stitch Plush Toy", price: "19.118", rating: 3 },
  { id: "3", name: "Pink Bunny Pillow", price: "71.756", rating: 1 },
  { id: "4", name: "Strawberry Blanket", price: "27.959", rating: 4 },
  { id: "5", name: "Cat Mug", price: "12.235", rating: 3 },
];

const renderStars = (rating: number) => {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return full + empty;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER estilo general de la app */}
      <View style={styles.header}>
        {/* Search + Country pill */}
        <View style={styles.headerRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 6 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.countryButton}>
            <Text style={styles.countryFlag}>🇨🇴</Text>
            <Text style={styles.countryText}>COL</Text>
            <Ionicons name="chevron-down" size={14} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerSubtitle}>Find products from any country</Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* FILTROS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((label) => (
            <TouchableOpacity key={label} style={styles.filterChip}>
              <Text style={styles.filterText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* GRID DE PRODUCTOS */}
        <FlatList
          data={PRODUCTS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false} // Scroll lo maneja el ScrollView principal
          columnWrapperStyle={styles.productsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  rating: item.rating,
                })
              }
            >
              {/* Imagen placeholder */}
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="image-outline"
                  size={28}
                  color="#9CA3AF"
                />
              </View>

              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.priceText}>${item.price}</Text>
              <Text style={styles.starsText}>{renderStars(item.rating)}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

// estilos iguales que ya tenías
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
    gap: 10,
  },
  headerSubtitle: {
    marginTop: 8,
    color: "#DBEAFE",
    fontSize: 13,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 6,
  },
  countryFlag: {
    fontSize: 16,
  },
  countryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    flex: 1,
  },
  filtersRow: {
    marginTop: 8,
  },
  filtersContent: {
    paddingRight: 4,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1D4ED8",
  },
  productsRow: {
    justifyContent: "space-between",
    marginTop: 16,
  },
  productCard: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  starsText: {
    fontSize: 13,
    color: "#F59E0B",
  },
});