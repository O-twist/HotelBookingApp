import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.navigate('AuthStack');
  };

  const screens = [
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
      title: 'Discover Amazing Hotels',
      subtitle: 'Find and book the perfect hotel for your next adventure with our easy-to-use app.',
    },
    {
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop',
      title: 'Easy Booking Process',
      subtitle: 'Book your stay in just a few taps with our streamlined booking system.',
    },
    {
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=400&fit=crop',
      title: 'Real Guest Reviews',
      subtitle: 'Read authentic reviews from other travelers to make the best choice.',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {screens.map((screen, index) => (
          <View key={index} style={[styles.screen, { width }]}>
            <Image source={{ uri: screen.image }} style={styles.image} />
            <Text style={styles.title}>{screen.title}</Text>
            <Text style={styles.subtitle}>{screen.subtitle}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});