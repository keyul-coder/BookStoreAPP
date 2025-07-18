import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function BorrowedBooksScreen({ navigation, borrowedBooks = [], setBorrowedBooks = () => {} }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDateString) => {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const returnBook = (id) => {
    Alert.alert(
      'Return Book',
      'Are you sure you want to return this book?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Return',
          onPress: () => {
            const updatedList = borrowedBooks.filter((b) => b.id !== id);
            setBorrowedBooks(updatedList);
            Alert.alert('Success', 'The book has been returned successfully!');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const daysUntilDue = getDaysUntilDue(item.dueDate);
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

    return (
      <View style={styles.bookCard}>
        <Image source={{ uri: item.coverImage }} style={styles.bookCover} />
        
        <View style={styles.bookInfo}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.author} numberOfLines={1}>by {item.author}</Text>
          
          <View style={styles.datesContainer}>
            <View style={styles.dateRow}>
              <MaterialIcons name="event" size={16} color="#868e96" />
              <Text style={styles.dateLabel}>Borrowed: </Text>
              <Text style={styles.dateValue}>{formatDate(item.borrowedDate)}</Text>
            </View>
            <View style={styles.dateRow}>
              <MaterialIcons 
                name={isOverdue ? "warning" : "event-available"} 
                size={16} 
                color={isOverdue ? '#fa5252' : isDueSoon ? '#fab005' : '#40c057'} 
              />
              <Text style={styles.dateLabel}>Due: </Text>
              <Text style={[
                styles.dateValue,
                isOverdue && styles.overdueText,
                isDueSoon && styles.dueSoonText
              ]}>
                {formatDate(item.dueDate)}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <LinearGradient
              colors={
                isOverdue 
                  ? ['#ff6b6b', '#fa5252'] 
                  : isDueSoon 
                  ? ['#ffd43b', '#fab005'] 
                  : ['#51cf66', '#40c057']
              }
              style={styles.statusBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.statusText}>
                {isOverdue 
                  ? `${Math.abs(daysUntilDue)} days overdue` 
                  : isDueSoon 
                  ? `Due in ${daysUntilDue} days` 
                  : `${daysUntilDue} days left`}
              </Text>
            </LinearGradient>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.returnButton}
          onPress={() => returnBook(item.id)}
        >
          <MaterialIcons name="keyboard-return" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4C6EF5', '#364FC7']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.heading}>My Borrowed Books</Text>
        <Text style={styles.subheading}>
          {borrowedBooks.length} of 3 books borrowed
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#82c91e', '#51cf66']}
              style={[styles.progressFill, { width: `${(borrowedBooks.length/3)*100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      </LinearGradient>

      {borrowedBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="book" size={48} color="#868e96" />
          <Text style={styles.emptyTitle}>No Books Borrowed</Text>
          <Text style={styles.emptyText}>
            You haven't borrowed any books yet. Browse our collection to find your next read!
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('BookList')}
          >
            <LinearGradient
              colors={['#4C6EF5', '#364FC7']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.browseButtonText}>Browse Books</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    height: 10,
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  listContent: {
    padding: 20,
    paddingBottom: 80,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bookCover: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
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
  datesContainer: {
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: '#868e96',
    marginLeft: 4,
  },
  dateValue: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  overdueText: {
    color: '#fa5252',
    fontWeight: '600',
  },
  dueSoonText: {
    color: '#fab005',
    fontWeight: '600',
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  returnButton: {
    backgroundColor: '#fa5252',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    borderRadius: 25,
    overflow: 'hidden',
    width: '70%',
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});