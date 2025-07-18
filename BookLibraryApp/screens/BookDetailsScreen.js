import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookDetailsScreen({ route, navigation, borrowedBooks, setBorrowedBooks }) {
  const { book } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const isAlreadyBorrowed = borrowedBooks.some((b) => b.id === book.id);
  const canBorrow = borrowedBooks.length < 3;

  const handleBorrow = () => {
    if (isAlreadyBorrowed) {
      Alert.alert('Already Borrowed', 'You already have this book in your collection.');
      return;
    }
    if (!canBorrow) {
      Alert.alert('Borrowing Limit', 'You can only borrow up to 3 books at a time.');
      return;
    }
    setBorrowedBooks([...borrowedBooks, book]);
    Alert.alert('Success', `"${book.title}" has been added to your collection!`, [
      { text: 'View My Books', onPress: () => navigation.navigate('BorrowedBooks') },
      { text: 'OK' }
    ]);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorite 
        ? `"${book.title}" has been removed from your favorites.` 
        : `"${book.title}" has been added to your favorites!`
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Book Cover and Basic Info */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <MaterialIcons 
            name={isFavorite ? 'favorite' : 'favorite-border'} 
            size={28} 
            color={isFavorite ? '#ff6b6b' : '#fff'} 
          />
        </TouchableOpacity>
      </View>

      {/* Book Title and Author */}
      <View style={styles.header}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        
        {/* Rating and Pages */}
        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{book.rating}/5.0</Text>
          </View>
          <View style={styles.pagesContainer}>
            <MaterialIcons name="menu-book" size={20} color="#4C6EF5" />
            <Text style={styles.pagesText}>{book.pages} pages</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Genre Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GENRE</Text>
        <View style={styles.genreBadge}>
          <Text style={styles.genreText}>{book.genre}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DESCRIPTION</Text>
        <Text style={styles.description}>{book.description}</Text>
      </View>

      {/* Details Table */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <MaterialIcons name="calendar-today" size={20} color="#4C6EF5" />
            <Text style={styles.detailLabel}>Published</Text>
            <Text style={styles.detailValue}>{book.publishedYear}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="language" size={20} color="#4C6EF5" />
            <Text style={styles.detailLabel}>Language</Text>
            <Text style={styles.detailValue}>{book.language}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <MaterialIcons name="library-books" size={20} color="#4C6EF5" />
            <Text style={styles.detailLabel}>ISBN</Text>
            <Text style={styles.detailValue}>{book.isbn}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="person" size={20} color="#4C6EF5" />
            <Text style={styles.detailLabel}>Publisher</Text>
            <Text style={styles.detailValue}>{book.publisher}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.borrowButton,
            (isAlreadyBorrowed || !canBorrow) && styles.disabledButton
          ]} 
          onPress={handleBorrow}
          disabled={isAlreadyBorrowed || !canBorrow}
        >
          <LinearGradient
            colors={['#4C6EF5', '#364FC7']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons name="book" size={24} color="#fff" />
            <Text style={styles.borrowButtonText}>
              {isAlreadyBorrowed ? 'Already Borrowed' : 'Borrow This Book'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {!canBorrow && !isAlreadyBorrowed && (
          <Text style={styles.limitText}>
            You've reached your borrowing limit (3/3). Return a book to borrow this one.
          </Text>
        )}

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Books</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  coverContainer: {
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  coverImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#212529',
    marginBottom: 5,
  },
  author: {
    fontSize: 18,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  pagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pagesText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  genreBadge: {
    backgroundColor: '#E9ECEF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  genreText: {
    color: '#212529',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#495057',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#868E96',
    marginTop: 5,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  borrowButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },
  buttonGradient: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  borrowButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  limitText: {
    color: '#FA5252',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#4C6EF5',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4C6EF5',
    fontSize: 16,
    fontWeight: '600',
  },
});