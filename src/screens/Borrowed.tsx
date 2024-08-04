import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [bookDetails, setBookDetails] = useState<any>({});

  useEffect(() => {
    const borrowedDoc = doc(firestore, "borrowedBooks", "global");

    const unsubscribe = onSnapshot(borrowedDoc, async (snapshot) => {
      if (snapshot.exists()) {
        const borrowedBookIds = snapshot.data().borrowedBooks || [];
        setBorrowedBooks(borrowedBookIds);

        const books: { [key: string]: any } = {};
        for (const bookId of borrowedBookIds) {
          const bookDoc = doc(firestore, "books", bookId);
          const bookSnapshot = await getDoc(bookDoc);
          if (bookSnapshot.exists()) {
            books[bookId] = bookSnapshot.data();
          }
        }
        setBookDetails(books);
      } else {
        setBorrowedBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const returnBook = async (bookId: string) => {
    Alert.alert("Return Book", "Are you sure you want to return this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Return",
        onPress: async () => {
          try {
            const updatedBorrowedBooks = borrowedBooks.filter(
              (id) => id !== bookId
            );
            setBorrowedBooks(updatedBorrowedBooks);

            const borrowedDoc = doc(firestore, "borrowedBooks", "global");
            await updateDoc(borrowedDoc, {
              borrowedBooks: updatedBorrowedBooks,
            });

            const newBookDetails = { ...bookDetails };
            delete newBookDetails[bookId];
            setBookDetails(newBookDetails);

            Alert.alert("Success", "Book returned successfully.");
          } catch (error) {
            console.error("Error returning book: ", error);
            Alert.alert(
              "Error",
              "Could not return the book. Please try again later."
            );
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: string }) => {
    const book = bookDetails[item];
    return (
      <View style={styles.itemContainer}>
        {book ? (
          <>
            {book.imageUrl && (
              <Image source={{ uri: book.imageUrl }} style={styles.bookImage} />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.bookTitle}>{book.name}</Text>
              <Text style={styles.bookAuthor}>by {book.author}</Text>
            </View>
            <TouchableOpacity
              style={styles.returnButton}
              onPress={() => returnBook(item)}
            >
              <Text style={styles.returnButtonText}>Return Book</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No borrowed books.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  itemContainer: {
    flexDirection: "column",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookImage: {
    width: 80,
    height: 120,
    marginBottom: 10,
    borderRadius: 5,
  },
  textContainer: {
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    color: "#6c757d",
  },
  returnButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  returnButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BorrowedBooks;
