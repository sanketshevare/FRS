import React, { useEffect } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "../../config/AuthContext";

const BuyCoupoun = () => {

  // const navigation = useNavigation();
  // // const auth = getAuth();
  // const { logout } = useAuth();

  // const handleSignOut = async () => {
  //   try {
  //     logout
  //     navigation.navigate("Login");
  //   } catch (error) {
  //     console.error("Sign-out error:", error.message);
  //   }
  // };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is logged in
  //       navigation.navigate("Home");
  //     } else {
  //       // User is logged out
  //       navigation.navigate("Login");
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [navigation]);

  return (
    <View style={tw`flex items-center justify-center h-full `}>
      <Text>BuyCoupoun</Text>
      {/* <TouchableOpacity style={tw`p-3 rounded-xl w-full bg-red-300`} onPress={() => handleSignOut()}>
        <Text>SignOut</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default BuyCoupoun;
