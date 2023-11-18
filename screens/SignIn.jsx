import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app, auth } from "../firebase"; // Import the app from the firebase.js file
import { CommonActions } from "@react-navigation/native";

const SignIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signInWithEmail() {
    setLoading(true);
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigation.navigate("Home");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
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
    <View style={tw`flex items-center justify-center h-full p-3`}>
      <View style={tw`z-10 top-40`}>
        {loading && <ActivityIndicator size="large" color="#000000" />}
      </View>
      <View>
        <Text style={tw`text-2xl text-gray-700`}>SignIn</Text>
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
        style={tw`p-3 bg-red-200 m-1 rounded-md`}
        onPress={() => signInWithEmail()}
      >
        <Text>SignIn</Text>
      </TouchableOpacity>

      <Text>Don't have an account yet?</Text>

      <TouchableOpacity
        style={tw`p-3 bg-red-200 m-1 rounded-md`}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;
