import React, { useEffect } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Settings = () => {

  const navigation = useNavigation();
  const auth = getAuth();

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
    <View style={tw`flex items-center justify-center h-full `}>
      <Text>Settings</Text>
      <TouchableOpacity onPress={() => handleSignOut()}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
