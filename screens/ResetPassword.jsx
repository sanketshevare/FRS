import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const isValidEmail = (email) => {
    // Basic email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleForgotPassword = async () => {
    setLoading(true);

    try {
      if (!isValidEmail(email)) {
        setLoading(false);
        setError("Please enter a valid email address.");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }

      await axios.post(
        "http://192.168.1.7:8000/auth/users/reset_password/",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful password reset request
      // setToken(response.data.access);

      setLoading(false);
      alert("Reset Link Sent Successfully!!");

      navigation.navigate("Login");
    } catch (error) {
      // Handle error in case of a failed password reset request
      console.error("Error:", error);
      setLoading(false);

      if (error.response) {
        if (error.response.status === 400 && error.response.data.email) {
          setError("Email not found. Please check your email address.");
        } else {
          setError("Server error. Please try again later.");
        }
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("Unexpected error. Please try again later.");
      }

      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1436262513933-a0b06755c784?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJhY2tncm91bmQlMjBpbWFnZSUyMGZvcmdvdCUyMHBhc3N3b3JkfGVufDB8fDB8fHww",
      }}
      resizeMode="contain"
    >
      <View style={tw`flex items-center justify-center h-full p-3`}>
        <View style={tw`z-10 top-40`}>
          {loading && <ActivityIndicator size="large" color="#000000" />}
        </View>
        <Text style={tw`text-lg`}>Reset Your Password</Text>

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
        ></TextInput>

        <TouchableOpacity
          style={tw`p-3 bg-gray-300 m-1 rounded-md`}
          onPress={handleForgotPassword}
        >
          <Text>Get Reset Link</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ResetPassword;
