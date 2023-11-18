import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import tw from "twrnc";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      // console.log("Password reset email sent successfully");
      setEmail("");
    } catch (error) {
      // console.error("Error sending password reset email:", error.message);
      let err = error.message.split(":");
      setError(err[1]);
      
      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        style={tw`p-3 bg-red-200 m-1 rounded-md`}
        onPress={handleForgotPassword}
      >
        <Text>Get Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;
