import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../config/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import Settings from "./Settings";
import { createDrawerNavigator } from "@react-navigation/drawer";

const ProfileScreen = ({ userData }) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <View style={tw`flex justify-center `}>
        {userData ? (
          <>
            <Text style={tw`text-left text-xl font-700 text-slate-800`}>
              Hey! {userData.first_name} {userData.last_name}
            </Text>

            <Image
              source={{
                uri: "https://cdn.pixabay.com/photo/2016/08/31/11/54/icon-1633249_640.png",
              }}
              style={tw`w-full h-60  `}
              resizeMode="contain"
            />

            <Text style={tw`text-base text-gray-500 p-1`}>
              Username: {userData.username}
            </Text>

            {userData.gender && (
              <Text style={tw`text-base text-gray-500 p-1`}>
                Gender: {userData.gender}
              </Text>
            )}
            {userData.birth_date && (
              <Text style={tw`text-base text-gray-500 p-1`}>
                DOB: {userData.birth_date}
              </Text>
            )}
            {userData.email && (
              <Text style={tw`text-base text-gray-500 p-1`}>
                Email: {userData.email}
              </Text>
            )}
            {userData.mobile_number && (
              <Text style={tw`text-base text-gray-500 p-1`}>
                Mobile: {userData.mobile_number}
              </Text>
            )}
          </>
        ) : (
          <View style={tw`z-100 top-50`}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        )}
      </View>
    </>
  );
};

const UserDataScreen = ({ userData, onUserDataUpdate }) => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(userData.first_name || "");
  const [lastName, setLastName] = useState(userData.last_name || "");
  const [error, setError] = useState(userData.mobile_number);
  const [mobileNumber, setMobileNumber] = useState(
    userData.mobile_number || ""
  );
  const [birthDate, setBirthDate] = useState(userData.birth_date || "");
  const [gender, setGender] = useState(userData.gender || "");

  const updateUser = async () => {
    setLoading(true);
    try {
      await axios.patch(
        "http://192.168.0.105:8000/auth/users/me/",
        {
          first_name: firstName || userData.first_name,
          last_name: lastName || userData.last_name,
          mobile_number: mobileNumber || userData.mobile_number,
          gender: gender || userData.gender,
          birth_date: birthDate || userData.birth_date,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "JWT " + accessToken,
          },
        }
      );
    } catch (error) {
      // console.error("Response data:", error.response.data);
      setError(error.response.data);
      // console.error("Response status:", error.response.status);
      // console.error("Response headers:", error.response.headers);
    } finally {
      onUserDataUpdate();
      setLoading(false);
    }
  };

  return (
    <>
      <View style={tw`flex justify-center items-center`}>
        <View style={tw`z-10 top-40`}>
          {loading && <ActivityIndicator size="large" color="#000000" />}
        </View>
        <Text style={tw`text-left text-xl font-700 text-slate-800`}>
          Edit Your Info
        </Text>

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
          placeholder="Mobile Number"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          value={mobileNumber}
          onChangeText={(e) => setMobileNumber(e)}
        />
        <TextInput
          placeholder="Birth Date (YYYY-MM-DD)"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          value={birthDate}
          onChangeText={(e) => {
            // Validate the input to ensure it matches the format YYYY-MM-DD
            const regex = /^\d{4}-\d{2}-\d{2}$/;

            setBirthDate(e); // Update the state only if the input is valid or empty
          }}
        />
        <TextInput
          placeholder="Gender"
          style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
          value={gender}
          onChangeText={(e) => setGender(e)}
        />

        <TouchableOpacity
          style={tw`p-3 w-2/4 bg-orange-400 rounded-md `}
          onPress={() => updateUser()}
        >
          <Text>UPDATE DETAILS</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const Tab = createMaterialTopTabNavigator();

const Profile = () => {
  const auth = getAuth();
  const { logout } = getAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState("");
  const { accessToken } = useAuth();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Sign-out error:", error.message);
    }
  };

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://192.168.0.105:8000/auth/users/me/",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "JWT " + accessToken,
          },
        }
      );
      console.log(response.data);

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleUserDataUpdate = () => {
    getUser();
  };

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile">
        {() => (
          <View style={{ flex: 1 }}>
            <Tab.Navigator>
              <Tab.Screen name="Your Account">
                {() => <ProfileScreen userData={userData} />}
              </Tab.Screen>
              <Tab.Screen name="Edit Profile">
                {() => (
                  <UserDataScreen
                    userData={userData}
                    onUserDataUpdate={handleUserDataUpdate}
                  />
                )}
              </Tab.Screen>
            </Tab.Navigator>
            <TouchableOpacity
              style={tw`p-3 rounded-xl w-full bottom-7 z-10 bg-red-300`}
              onPress={() => handleSignOut()}
            >
              <Text style={tw`text-center text-base`}>
                SIGN OUT{" "}
                <Ionicons
                  style={tw`text-lg`}
                  name={"log-out-outline"}
                  color={"black"}
                  size={25}
                />
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};
export default Profile;
