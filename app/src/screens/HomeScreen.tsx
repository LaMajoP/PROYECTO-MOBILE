// src/screens/HomeScreen.tsx

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

type Product = {
  id: string;
  price: string;
  rating: number; // 1 a 5
};

const FILTERS = ['Electronics', 'Home', 'Beauty & Health'];

const PRODUCTS: Product[] = [
  { id: '1', price: '19.118', rating: 2 },
  { id: '2', price: '19.118', rating: 3 },
  { id: '3', price: '71.756', rating: 1 },
  { id: '4', price: '27.959', rating: 4 },
  { id: '5', price: '12.235', rating: 3 },
];

const renderStars = (rating: number) => {
  const full = '★'.repeat(rating);
  const empty = '☆'.repeat(5 - rating);
  return full + empty;
};

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER AZUL */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity style={styles.countryButton}>
          <Text style={styles.countryFlag}>🇨🇴</Text>
          <Text style={styles.countryText}>COL</Text>
          <Text style={styles.countryArrow}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO SCROLLABLE */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
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
          scrollEnabled={false} // para que el ScrollView principal maneje el scroll
          columnWrapperStyle={styles.productsRow}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {/* Aquí luego puedes poner <Image /> */}
              <View style={styles.imagePlaceholder} />

              <Text style={styles.priceText}>${item.price}</Text>
              <Text style={styles.starsText}>{renderStars(item.rating)}</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1D6FB5', // azul superior
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 40,
  },
  searchInput: {
    fontSize: 14,
    color: '#111827',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    gap: 4,
  },
  countryFlag: {
    fontSize: 18,
  },
  countryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  countryArrow: {
    fontSize: 12,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filtersRow: {
    marginTop: 12,
  },
  filtersContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#111827',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  productsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 16,
  },
  productCard: {
    width: '48%',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1, // cuadrado
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  priceText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
  },
  starsText: {
    marginTop: 4,
    fontSize: 14,
  },
});