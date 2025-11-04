import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BookingScreen({ route, navigation }) {
  const { hotel } = route.params;
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState({ in: false, out: false });
  const [loading, setLoading] = useState(false);

  const calculateNights = () => {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = timeDiff / (1000 * 3600 * 24);
    return Math.max(1, Math.ceil(nights));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return (hotel.price * nights * rooms).toFixed(2);
  };

  const handleConfirmBooking = async () => {
    if (!auth.currentUser) {
      Alert.alert(
        'Sign In Required', 
        'Please sign in to make a booking.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign In', 
            onPress: () => navigation.navigate('AuthStack')
          }
        ]
      );
      return;
    }

    if (checkOut <= checkIn) {
      Alert.alert('Error', 'Check-out date must be after check-in date.');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        userId: auth.currentUser.uid,
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        rooms: rooms,
        total: calculateTotal(),
        status: 'confirmed',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your stay at ${hotel.name} for $${calculateTotal()} has been confirmed.`,
        [
          {
            text: 'View Bookings',
            onPress: () => navigation.navigate('AppStack', { 
              screen: 'MainTabs', 
              params: { screen: 'ProfileTab' }
            }),
          },
          {
            text: 'Continue Exploring',
            onPress: () => navigation.navigate('AppStack', { 
              screen: 'MainTabs', 
              params: { screen: 'ExploreTab' }
            }),
          }
        ]
      );

    } catch (error) {
      console.error('Error adding booking: ', error);
      Alert.alert('Error', 'Failed to save booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate, type) => {
    setShowDatePicker({ in: false, out: false });
    if (selectedDate) {
      if (type === 'in') {
        setCheckIn(selectedDate);
        if (checkOut <= selectedDate) {
          setCheckOut(new Date(selectedDate.getTime() + 86400000));
        }
      } else {
        setCheckOut(selectedDate);
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Book Your Stay</Text>
      <Text style={styles.hotelName}>{hotel.name}</Text>

      {/* Check-in Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Check-in Date</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker({ ...showDatePicker, in: true })}
          disabled={loading}
        >
          <Text style={styles.dateText}>{formatDate(checkIn)}</Text>
        </TouchableOpacity>
        {showDatePicker.in && (
          <DateTimePicker
            value={checkIn}
            mode="date"
            display="default"
            onChange={(event, date) => onDateChange(event, date, 'in')}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Check-out Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Check-out Date</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker({ ...showDatePicker, out: true })}
          disabled={loading}
        >
          <Text style={styles.dateText}>{formatDate(checkOut)}</Text>
        </TouchableOpacity>
        {showDatePicker.out && (
          <DateTimePicker
            value={checkOut}
            mode="date"
            display="default"
            onChange={(event, date) => onDateChange(event, date, 'out')}
            minimumDate={new Date(checkIn.getTime() + 86400000)}
          />
        )}
      </View>

      {/* Guests */}
      <View style={styles.section}>
        <Text style={styles.label}>Guests</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity 
            style={[styles.counterButton, loading && styles.buttonDisabled]}
            onPress={() => setGuests(Math.max(1, guests - 1))}
            disabled={loading}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{guests}</Text>
          <TouchableOpacity 
            style={[styles.counterButton, loading && styles.buttonDisabled]}
            onPress={() => setGuests(guests + 1)}
            disabled={loading}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rooms */}
      <View style={styles.section}>
        <Text style={styles.label}>Rooms</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity 
            style={[styles.counterButton, loading && styles.buttonDisabled]}
            onPress={() => setRooms(Math.max(1, rooms - 1))}
            disabled={loading}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{rooms}</Text>
          <TouchableOpacity 
            style={[styles.counterButton, loading && styles.buttonDisabled]}
            onPress={() => setRooms(rooms + 1)}
            disabled={loading}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stay Duration */}
      <View style={styles.section}>
        <Text style={styles.label}>Stay Duration</Text>
        <Text style={styles.durationText}>
          {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Price Breakdown */}
      <View style={styles.priceSection}>
        <Text style={styles.priceTitle}>Price Breakdown</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>
            ${hotel.price} × {calculateNights()} nights × {rooms} room{rooms > 1 ? 's' : ''}
          </Text>
          <Text style={styles.priceValue}>${calculateTotal()}</Text>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>${calculateTotal()}</Text>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity 
        style={[styles.confirmButton, loading && styles.buttonDisabled]} 
        onPress={handleConfirmBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>Back to Hotel</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  hotelName: {
    fontSize: 18,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  counterButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  durationText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  priceSection: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#666',
    fontSize: 14,
  },
  priceValue: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    marginBottom: 30,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});