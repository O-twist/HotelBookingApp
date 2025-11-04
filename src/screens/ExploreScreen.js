import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const sampleHotels = [
  {
    id: '1',
    name: 'Luxury Beach Resort',
    location: 'Bali, Indonesia',
    rating: 4.8,
    price: 250,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    description: 'Beautiful beachfront resort with private pools and spa services.',
  },
  {
    id: '2',
    name: 'Mountain View Hotel',
    location: 'Swiss Alps, Switzerland',
    rating: 4.6,
    price: 180,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop',
    description: 'Cozy hotel with stunning mountain views and ski facilities.',
  },
  {
    id: '3',
    name: 'City Center Suites',
    location: 'New York, USA',
    rating: 4.4,
    price: 320,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop',
    description: 'Modern suites in the heart of the city with premium amenities.',
  },
  {
    id: '4',
    name: 'Tropical Paradise Resort',
    location: 'Maldives',
    rating: 4.9,
    price: 450,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop',
    description: 'Overwater bungalows with crystal clear waters and luxury service.',
  },
  {
    id: '5',
    name: 'Historic Grand Hotel',
    location: 'Paris, France',
    rating: 4.7,
    price: 280,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&h=300&fit=crop',
    description: 'Classic Parisian hotel with historic charm and modern amenities.',
  },
  {
    id: '6',
    name: 'Desert Oasis Resort',
    location: 'Dubai, UAE',
    rating: 4.5,
    price: 380,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop',
    description: 'Luxury desert resort with world-class facilities and views.',
  },
];

export default function ExploreScreen({ navigation }) {
  const [hotels, setHotels] = useState(sampleHotels);
  const [sortBy, setSortBy] = useState('name');

  const sortedHotels = [...hotels].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetails', { hotel: item })}
    >
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {item.rating}</Text>
          <Text style={styles.price}>${item.price}/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Perfect Stay</Text>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, sortBy === 'price' && styles.filterButtonActive]}
          onPress={() => setSortBy('price')}
        >
          <Text style={[styles.filterText, sortBy === 'price' && styles.filterTextActive]}>
            Price
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, sortBy === 'rating' && styles.filterButtonActive]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.filterText, sortBy === 'rating' && styles.filterTextActive]}>
            Rating
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, sortBy === 'name' && styles.filterButtonActive]}
          onPress={() => setSortBy('name')}
        >
          <Text style={[styles.filterText, sortBy === 'name' && styles.filterTextActive]}>
            Name
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedHotels}
        renderItem={renderHotelCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hotels found.</Text>
        }
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  hotelInfo: {
    padding: 15,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#FF9529',
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});