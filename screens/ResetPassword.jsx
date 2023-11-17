import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import tw from "twrnc";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();

// ... (previous imports)

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
    }
  };

  return (
    <View style={tw`flex items-center justify-center h-full p-3`}>
      
      <Text style={tw`text-lg`}>Reset Your Password</Text>
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
