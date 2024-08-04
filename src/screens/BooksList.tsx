
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const BooksList = ({ navigation }: any) => {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(firestore, "books");
        const booksSnapshot = await getDocs(booksCollection);
        const booksList = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksList);
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchBooks();
  }, []);

  const renderBookItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle}>{item.name}</Text>
        <Text style={styles.bookAuthor}>by {item.author}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View Details"
          onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 5,
  },
  buttonContainer: {
    marginLeft: 10,
  },
});

export default BooksList;
