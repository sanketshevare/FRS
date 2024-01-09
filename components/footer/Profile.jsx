import React, { useEffect } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "../../config/AuthContext";
const Profile = () => {

  const navigation = useNavigation();
  // const auth = getAuth();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      logout
      navigation.navigate("Login");
    } catch (error) {
      console.error("Sign-out error:", error.message);
    }
  };
  return (
    <View style={tw`flex items-center justify-center h-full`}>
      <Text>Profile</Text>
      <TouchableOpacity style={tw`p-3 rounded-xl w-full bg-red-300`} onPress={() => handleSignOut()}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile