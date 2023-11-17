import React, {useEffect} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged, signOut} from 'firebase/auth';

const auth = getAuth();


const Home = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error('Sign-out error:', error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        navigation.navigate('Home');
      } else {
        // User is logged out
        navigation.navigate('Login');
      }
    });
  
    return () => unsubscribe();
  }, [navigation]);
  
  return (
      <View  style={tw`flex-1 items-center justify-center h-full`}>
        <Text>Home</Text>

        <TouchableOpacity onPress={() => handleSignOut()}><Text>Sign Out</Text></TouchableOpacity>

      </View>
  );
};

export default Home;
