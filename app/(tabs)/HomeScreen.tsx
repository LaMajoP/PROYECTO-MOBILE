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
  Image,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabaseClient";

type Product = {
  id: string;
  name: string;
  price: string;
  image_url: string | null;
  rating: number;
};

const FILTERS = ["Electronics", "Home", "Beauty & Health"];

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  /* ============================================================
        FETCH + FILTER
  ============================================================ */
  const loadProducts = async () => {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("id, name, price, image_url, type");

    if (activeFilter) {
      query = query.eq("type", activeFilter.toLowerCase());
    }

    const { data, error } = await query;

    if (error) {
      console.log("❌ Error cargando productos:", error);
      return;
    }

    const formatted = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price.toString(),
      image_url: item.image_url,
      rating: Math.floor(Math.random() * 5) + 1, // temporal
    }));

    setProducts(formatted);
    setLoading(false);
  };

  React.useEffect(() => {
    loadProducts();
  }, [activeFilter]);

  /* ============================================================
        PULL TO REFRESH
  ============================================================ */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const renderStars = (rating: number) => {
    const full = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return full + empty;
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: "/product/ProductDetailScreen",
      params: {
        id: product.id,
        name: product.name,
        price: product.price,
        rating: product.rating.toString(),
        image_url: product.image_url,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
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
        </View>

        <Text style={styles.headerSubtitle}>
          Find products from around the world
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D6FB5" />
        }
      >
        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((label) => {
            const normalized = label.toLowerCase();
            const isActive = activeFilter === normalized;

            return (
              <TouchableOpacity
                key={label}
                onPress={() => setActiveFilter(isActive ? null : normalized)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PRODUCTS GRID */}
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.productsRow}
            renderItem={({ item }) => {
              console.log("IMG:", item.image_url); // 🟦 Debug real

              return (
                <TouchableOpacity
                  style={styles.productCard}
                  activeOpacity={0.85}
                  onPress={() => handleProductPress(item)}
                >
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.image}
                      resizeMode="cover"
                      onError={() => console.log("⚠️ Error cargando imagen:", item.image_url)}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
                    </View>
                  )}

                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.priceText}>${item.price}</Text>
                  <Text style={styles.starsText}>{renderStars(item.rating)}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ============================================================
        STYLES
============================================================ */
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  headerSubtitle: {
    marginTop: 8,
    color: "#DBEAFE",
    fontSize: 13,
    textAlign: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    flex: 1,
  },

  searchInput: { flex: 1, fontSize: 14, color: "#111827" },

  content: { flex: 1 },

  filtersRow: { marginTop: 8 },

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

  filterChipActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1D4ED8",
  },

  filterTextActive: { color: "#FFFFFF" },

  productsRow: { justifyContent: "space-between", marginTop: 16 },

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

  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    marginBottom: 8,
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

  starsText: { fontSize: 13, color: "#F59E0B" },
});