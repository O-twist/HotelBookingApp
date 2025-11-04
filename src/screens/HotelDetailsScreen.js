import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { auth } from '../../firebase';

const sampleReviews = [
  {
    id: '1',
    user: 'John Doe',
    rating: 5,
    text: 'Amazing hotel with great service! Will definitely come back.',
    date: '2024-01-15',
  },
  {
    id: '2',
    user: 'Jane Smith',
    rating: 4,
    text: 'Great location and comfortable rooms. Breakfast was excellent.',
    date: '2024-01-10',
  },
];

export default function HotelDetailsScreen({ route, navigation }) {
  const { hotel } = route.params;
  const [reviews, setReviews] = useState(sampleReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });

    const handleBookNow = () => {
    if (!auth.currentUser) {
        Alert.alert('Sign In Required', 'Please sign in to make a booking.');
        navigation.navigate('AuthStack');
        return;
    }
    navigation.navigate('Booking', { hotel });
    };

  const handleAddReview = () => {
    if (!auth.currentUser) {
      Alert.alert('Sign In Required', 'Please sign in to add a review.');
      navigation.navigate('SignIn');
      return;
    }
    setShowReviewForm(true);
  };

  const submitReview = () => {
    if (!newReview.text.trim()) {
      Alert.alert('Error', 'Please enter your review text.');
      return;
    }

    const review = {
      id: Date.now().toString(),
      user: auth.currentUser.displayName || 'Anonymous',
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, text: '' });
    setShowReviewForm(false);
    Alert.alert('Success', 'Thank you for your review!');
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
      
      <View style={styles.content}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.location}</Text>
        
        <View style={styles.ratingPriceContainer}>
          <Text style={styles.rating}>★ {hotel.rating}</Text>
          <Text style={styles.price}>${hotel.price}/night</Text>
        </View>

        <Text style={styles.description}>{hotel.description}</Text>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            <TouchableOpacity onPress={handleAddReview}>
              <Text style={styles.addReviewButton}>Add Review</Text>
            </TouchableOpacity>
          </View>

          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
          ) : (
            reviews.map(review => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{review.user}</Text>
                  <Text style={styles.reviewRating}>{renderStars(review.rating)}</Text>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Add Review Modal */}
      <Modal
        visible={showReviewForm}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Your Review</Text>
            
            <Text style={styles.ratingLabel}>Rating:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setNewReview({...newReview, rating: star})}
                >
                  <Text style={[styles.star, star <= newReview.rating && styles.starSelected]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review..."
              value={newReview.text}
              onChangeText={(text) => setNewReview({...newReview, text})}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowReviewForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitReview}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hotelImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 18,
    color: '#FF9529',
    fontWeight: '600',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 30,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  reviewsSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addReviewButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  reviewItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUser: {
    fontWeight: 'bold',
    color: '#333',
  },
  reviewRating: {
    color: '#FF9529',
    fontSize: 16,
  },
  reviewText: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 30,
    color: '#ddd',
    marginRight: 5,
  },
  starSelected: {
    color: '#FF9529',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});