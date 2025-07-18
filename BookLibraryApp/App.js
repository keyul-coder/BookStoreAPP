// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookListScreen from './screens/BookListScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';
import BorrowedBooksScreen from './screens/BorrowedBooksScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="BookList" 
          options={{ title: 'Book Library' }}
        >
          {(props) => (
            <BookListScreen 
              {...props} 
              borrowedBooks={borrowedBooks}
            />
          )}
        </Stack.Screen>

        <Stack.Screen 
          name="BookDetails"
          options={{ title: 'Book Details' }}
        >
          {(props) => (
            <BookDetailsScreen
              {...props}
              borrowedBooks={borrowedBooks}
              setBorrowedBooks={setBorrowedBooks}
            />
          )}
        </Stack.Screen>

        <Stack.Screen 
          name="BorrowedBooks"
          options={{ title: 'My Borrowed Books' }}
        >
          {(props) => (
            <BorrowedBooksScreen
              {...props}
              borrowedBooks={borrowedBooks}
              setBorrowedBooks={setBorrowedBooks}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}