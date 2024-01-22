import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const SignUp = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const clearError = () => {
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  const signUpWithEmail = async () => {
    setLoading(true);

    try {
      if (!isValidEmail(email)) {
        setError("Invalid email address");
        clearError();
        return;
      }

      if (!isValidPassword(password)) {
        setError("Password must be at least 6 characters");
        clearError();
        return;
      }

      if (password !== newPassword) {
        setError("Passwords do not match");
        clearError();
        return;
      }

      const response = await axios.post(
        "http://192.168.1.7:8000/auth/users/",
        {
          email: email,
          password: password,
          re_password: newPassword,
          first_name: firstName,
          last_name: lastName,
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Access Token:", response.data.access);
      setLoading(false);
      alert("Signed Up Successfully!!");
      navigation.navigate("Login");

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
      if (error.response) {
        if (error.response.status === 400 && error.response.data.email) {
          // Handle the case where the username already exists
          setError("Email already exists");
        } else {
          setError("Server error. Please try again later.");
        }
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("Unexpected error. Please try again later.");
      }

      clearError();
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506143925201-0252c51780b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGJhY2tncm91bmQlMjBpbWFnZSUyMHdhcmRyb2JlfGVufDB8fDB8fHww",
      }}
    >
      <View style={tw`flex items-center justify-center h-full p-3`}>
        <View style={tw`z-10 top-40`}>
          {loading ||
            (error && <ActivityIndicator size="large" color="#000000" />)}
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
        {error && error.includes("Invalid email") && (
          <Text style={tw`text-red-500 text-sm m-1`}>{error}</Text>
        )}

        <TextInput
          placeholder="Password"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          secureTextEntry={true}
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
        {error && error.includes("Password must be") && (
          <Text style={tw`text-red-500 text-sm m-1`}>{error}</Text>
        )}

        <TextInput
          placeholder="Confirm Password"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          secureTextEntry={true}
          value={newPassword}
          onChangeText={(e) => setNewPassword(e)}
        />
        {error && error.includes("Passwords do not match") && (
          <Text style={tw`text-red-500 text-sm m-1`}>{error}</Text>
        )}

        <TextInput
          placeholder="First Name"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          value={firstName}
          onChangeText={(e) => setFirstName(e)}
        />

        <TextInput
          placeholder="Last Name"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          value={lastName}
          onChangeText={(e) => setLastName(e)}
        />

        <TextInput
          placeholder="Username"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          value={username}
          onChangeText={(e) => setUsername(e)}
        />

        <TouchableOpacity
          style={tw`p-3 bg-orange-300 m-1 rounded-md`}
          onPress={signUpWithEmail}
        >
          <Text>SignUp</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SignUp;
