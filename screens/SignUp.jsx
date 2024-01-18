import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app, auth } from "../firebase"; // Import the app from the firebase.js file

const SignUp = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  async function signUpWithEmail() {
    setLoading(true);

    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credentials.user;
    } catch (error) {
      let err = error.message.split(":");
      setError(err[1]);
      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
    source={{uri: "https://images.unsplash.com/photo-1506143925201-0252c51780b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGJhY2tncm91bmQlMjBpbWFnZSUyMHdhcmRyb2JlfGVufDB8fDB8fHww"}}
    >
      <View style={tw`flex items-center justify-center h-full p-3`}>
        <View style={tw`z-10 top-40`}>
          {loading && <ActivityIndicator size="large" color="#000000" />}
        </View>

        <View>
          <Text style={tw`text-2xl text-gray-700`}>SignUp</Text>
        </View>

        {error && (
          <Text
            style={tw`text-black p-3 bg-red-200 w-full text-center text-md m-1`}
          >
            {error}
          </Text>
        )}
        <TextInput
          placeholder="Email"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          placeholder="Password"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          secureTextEntry={true}
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
        <TouchableOpacity
          style={tw`p-3 bg-orange-300 m-1 rounded-md`}
          onPress={() => signUpWithEmail()}
        >
          <Text>SignUp</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SignUp;
