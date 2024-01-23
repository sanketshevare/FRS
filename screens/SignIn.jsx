import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  ImageBackground,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { app, auth } from "../firebase"; // Import the app from the firebase.js file
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../config/AuthContext";

const SignIn = () => {
  const navigation = useNavigation();
  const { setToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.0.101:8000/user/login/",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Access Token:", response.data.token);
      setToken(response.data.token);
      setLoading(false);
      navigation.navigate("Home");

      // Navigate to the home screen or perform other actions upon successful login
      // navigation.dispatch(
      //   CommonActions.reset({
      //     // index: 0,
      //     routes: [{ name: "Home" }],
      //   })
      // );
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setError("Invalid Username/Password!");

      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJhY2tncm91bmQlMjBpbWFnZSUyMGZ1c2lvbnxlbnwwfHwwfHx8MA%3D%3D",
      }}
    >
      <View style={tw`flex items-center justify-center h-full p-3 `}>
        <View style={tw`z-10 top-40`}>
          {loading && <ActivityIndicator size="large" color="#000000" />}
        </View>
        <View>
          <Text style={tw`text-2xl text-gray-700`}>SIGN IN</Text>
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
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full web:w-98 rounded-md`}
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          placeholder="Password"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full web:w-98 rounded-md`}
          secureTextEntry={true}
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
        <TouchableOpacity
          style={tw`m-1`}
          onPress={() => navigation.navigate("ResetPassword")}
        >
          <Text>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`p-3 bg-blue-200 m-1 rounded-md w-1/4`}
          onPress={() => handleLogin()}
        >
          <Text style={tw`text-center text-md font-bold`}>LOGIN</Text>
        </TouchableOpacity>
        <Text>Don't have an account yet?</Text>
        <TouchableOpacity
          style={tw`p-3 bg-blue-200 m-1 rounded-md w-1/4`}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={tw`text-center text-md font-bold`}>SIGNUP</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SignIn;
