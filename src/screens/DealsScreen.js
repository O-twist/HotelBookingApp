import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function DealsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      // Treat these products as hotel deals
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const renderDealItem = ({ item }) => (
    <View style={styles.dealCard}>
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      <View style={styles.dealInfo}>
        <Text style={styles.dealTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.dealCategory}>{item.category}</Text>
        <View style={styles.dealFooter}>
          <Text style={styles.dealPrice}>${item.price}</Text>
          <Text style={styles.dealRating}>★ {item.rating?.rate}</Text>
        </View>
        <Text style={styles.dealDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading special deals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubtext}>Please check your connection and try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Special Deals</Text>
      <Text style={styles.subtitle}>Exclusive offers just for you</Text>
      
      <FlatList
        data={products}
        renderItem={renderDealItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  dealImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  dealInfo: {
    flex: 1,
    padding: 15,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  dealCategory: {
    fontSize: 12,
    color: '#007AFF',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  dealRating: {
    fontSize: 14,
    color: '#FF9529',
    fontWeight: '500',
  },
  dealDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});