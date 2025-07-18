import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setRefreshing(true);
    try {
      const snapshot = await getDocs(collection(db, 'books'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const title = book.title?.toLowerCase?.() || '';
    const author = book.author?.toLowerCase?.() || '';
    const query = search.toLowerCase();
    return title.includes(query) || author.includes(query);
  });
  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookCard} 
      onPress={() => navigation.navigate('BookDetails', { book: item })}
    >
      <Image source={{ uri: item.coverImage }} style={styles.bookCover} />
      
      <View style={styles.bookInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author} numberOfLines={1}>by {item.author}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating || '4.8'}/5.0</Text>
          </View>
          
          <View style={styles.genreBadge}>
            <Text style={styles.genreText}>{item.genre}</Text>
          </View>
        </View>
        
        <View style={styles.availabilityContainer}>
          <View style={styles.availabilityDot} />
          <Text style={styles.availabilityText}>Available</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4C6EF5', '#364FC7']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.heading}>BookLibrary</Text>
        <Text style={styles.subheading}>Discover your next favorite book</Text>
      </LinearGradient>
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#868e96" style={styles.searchIcon} />
        <TextInput
          placeholder="Search by title or author..."
          placeholderTextColor="#868e96"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4C6EF5" />
        </View>
      ) : filteredBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={48} color="#868e96" />
          <Text style={styles.emptyText}>No books found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={fetchBooks}
          ListHeaderComponent={
            <Text style={styles.listHeader}>Available Books ({filteredBooks.length})</Text>
          }
        />
      )}
      
      <TouchableOpacity 
        style={styles.borrowedButton}
        onPress={() => navigation.navigate('BorrowedBooks')}
      >
        <LinearGradient
          colors={['#51CF66', '#40C057']}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialIcons name="bookmark" size={20} color="#fff" />
          <Text style={styles.borrowedButtonText}>My Borrowed Books</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#212529',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#495057',
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#868e96',
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 12,
    marginTop: 8,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bookCover: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  bookInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 4,
  },
  genreBadge: {
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  genreText: {
    fontSize: 12,
    color: '#212529',
    fontWeight: '600',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#51CF66',
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: '#2B8A3E',
    fontWeight: '500',
  },
  borrowedButton: {
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borrowedButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});