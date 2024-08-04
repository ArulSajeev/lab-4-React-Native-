import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const BookDetail = ({ route }: any) => {
  const { bookId } = route.params;
  const [book, setBook] = useState<any>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookDoc = doc(firestore, "books", bookId);
        const bookSnapshot = await getDoc(bookDoc);
        if (bookSnapshot.exists()) {
          setBook(bookSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching book: ", error);
      }
    };

    const fetchBorrowedBooks = async () => {
      try {
        const borrowedDoc = doc(firestore, "borrowedBooks", "global"); 
        const borrowedSnapshot = await getDoc(borrowedDoc);
        if (borrowedSnapshot.exists()) {
          setBorrowedBooks(borrowedSnapshot.data().borrowedBooks || []);
        } else {
          await setDoc(borrowedDoc, { borrowedBooks: [] });
          setBorrowedBooks([]);
        }
      } catch (error) {
        console.error("Error fetching borrowed books: ", error);
      }
    };

    fetchBook();
    fetchBorrowedBooks();
  }, [bookId]);

  const borrowBook = async () => {
    if (borrowedBooks.length >= 3) {
      Alert.alert(
        "Limit Reached",
        "You cannot borrow more than 3 books at a time.",
        [{ text: "OK" }]
      );
      return;
    }

    if (borrowedBooks.includes(bookId)) {
      Alert.alert("Already Borrowed", "This book is already borrowed.", [
        { text: "OK" },
      ]);
      return;
    }

    const message =
      borrowedBooks.length === 2
        ? "You are about to reach the borrowing limit of 3 books. Do you want to proceed?"
        : "Do you want to borrow this book?";

    Alert.alert("Confirm Borrowing", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Borrow",
        onPress: async () => {
          try {
            const newBorrowedBooks = [...borrowedBooks, bookId];
            setBorrowedBooks(newBorrowedBooks);

            const borrowedDoc = doc(firestore, "borrowedBooks", "global");
            await updateDoc(borrowedDoc, {
              borrowedBooks: newBorrowedBooks,
            });

            Alert.alert("Success", "Book borrowed successfully.");
          } catch (error) {
            console.error("Error borrowing book: ", error);
            Alert.alert(
              "Error",
              "Could not borrow the book. Please try again later."
            );
          }
        },
      },
    ]);
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {book.imageUrl && (
        <Image source={{ uri: book.imageUrl }} style={styles.bookImage} />
      )}
      <Text style={styles.bookTitle}>{book.name}</Text>
      <Text style={styles.bookAuthor}>by {book.author}</Text>
      <Text style={styles.bookSummary}>{book.summary}</Text>
      <Text style={styles.bookRating}>Rating: {book.rating}</Text>
      <TouchableOpacity style={styles.borrowButton} onPress={borrowBook}>
        <Text style={styles.borrowButtonText}>Borrow Book</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    alignItems: "center",
  },
  bookImage: {
    width: 150,
    height: 220,
    marginBottom: 20,
    borderRadius: 10,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 10,
    textAlign: "center",
  },
  bookSummary: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  bookRating: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  borrowButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  borrowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookDetail;
