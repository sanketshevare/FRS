import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  Button,
  Container,
  Footer,
  Icon,
  Content,
  FooterTab,
  Header,
  NativeBaseProvider,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Search from "./footer/Search";
import Calendar from "./footer/Calendar";
import Settings from "./footer/Settings";
import Splash from "./footer/Splash"
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const auth = getAuth();

const Tab = createBottomTabNavigator();

const Home = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Sign-out error:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        navigation.navigate("Home");
      } else {
        // User is logged out
        navigation.navigate("Login");
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Search") {
            iconName = focused
              ? "ios-search"
              : "ios-search-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "ios-settings" : "ios-settings-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "ios-calendar" : "ios-calendar-outline";
          } else if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Splash}
        options={{ headerShown: false }}
      />
        <Tab.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{ headerShown: false }}
      />
       <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default Home;
