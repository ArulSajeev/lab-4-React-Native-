import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BooksList from "../screens/BooksList";
import BookDetail from "../screens/BookDetail";
import BorrowedBooks from "../screens/Borrowed";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BooksList"
      component={BooksList}
      options={{ title: "Books List" }}
    />
    <Stack.Screen
      name="BookDetail"
      component={BookDetail}
      options={{ title: "Book Detail" }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Borrowed" component={BorrowedBooks} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
