import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Clipboard,
  ScrollView,
  Modal,
} from "react-native";
import tw from "twrnc";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../config/AuthContext";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const GetCoupon = () => {
  const [couponData, setCouponData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState("");
  const [code, setCode] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [expDate, setExpDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();
  const { accessToken } = useAuth();
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const navigation = useNavigation();

  const handleGetCoupon = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://192.168.0.105:8000/api/coupoundata/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "JWT " + accessToken,
          },
        }
      );
      setCouponData(response.data.results);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("Invalid Username/Password!");

      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  const handleCopyCode = (code) => {
    Clipboard.setString(code);
    // You can display a message or perform any other action after copying
    console.log("Code copied to clipboard:", code);
  };

  useEffect(() => {
    handleGetCoupon();
    console.log("gh");
  }, [modalVisible]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Fetch data or handle any other logic when the tab is focused
      handleGetCoupon();
    });

    // Cleanup the subscription when the component unmounts
    return unsubscribe;
  }, [modalVisible]);

  //modal

  const handleAddCoupon = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.0.105:8000/api/coupoundata/",
        {
          code: code,
          brand: brand,
          discount: discount,
          min_amount: minAmount,
          desc: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "JWT " + accessToken,
          },
        }
      );
      setModalVisible(!modalVisible);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to add coupon");

      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <>
      <ScrollView style={tw`h-full`}>
        <View style={tw`flex  h-full mb-10`}>
          <Text
            style={tw`text-lg font-bold text-center bg-blue-200 w-full pt-3`}
          ></Text>
          <View style={tw`top-0 z-50`}>
            <Text
              style={tw`text-2xl font-bold text-center bg-blue-200 w-full pb-2`}
            >
              Buy Coupon
            </Text>
          </View>
          {loading && (
            <View style={tw`z-30`}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          )}
          <View style={tw`p-1`}>
            {couponData &&
              couponData.map((item, index) => (
                <View
                  key={index}
                  style={tw`bg-orange-100 p-3 w-full border-2 border-slate-700 rounded-md mb-1 `}
                >
                  <Text style={tw`font-600 text-stone-600 text-base`}>
                    Brand: {item.brand}
                  </Text>
                  <TouchableOpacity onPress={() => handleCopyCode(item.code)}>
                    <Text style={tw`font-600 text-stone-600 text-base`}>
                      Code: {item.code}{" "}
                      <Ionicons
                        name={"copy-outline"}
                        color={"black"}
                        size={20}
                      />
                    </Text>
                  </TouchableOpacity>

                  <Text style={tw`font-600 text-stone-600 text-base`}>
                    Discount: {item.discount}
                  </Text>
                  <Text style={tw`font-600 text-stone-600 text-base`}>
                    Minimum Amount: {item.min_amount}
                  </Text>
                  <Text style={tw`font-600 text-stone-600 text-base`}>
                    Description: {item.desc}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={tw`absolute bottom-3 right-0 p-5 `}
      >
        <Ionicons name={"add-circle-outline"} color={"orange"} size={70} />
      </TouchableOpacity>

      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          statusBarTranslucent={true}
          presentationStyle="overFullScreen"
          style={tw`h-96`}
        >
          <View style={tw`flex items-center`}>
            <Text
              style={tw`text-lg font-bold text-center bg-blue-200 w-full pt-3`}
            ></Text>
            <View style={tw`flex-row `}>
              <Text
                style={tw`text-2xl font-bold text-center bg-blue-200 w-full pb-2`}
              >
                Add Coupon
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={tw`ml-auto p-1`}
              >
                <Text
                  style={tw`text-2xl font-bold text-center bg-blue-200 w-full `}
                >
                  <Ionicons name={"close"} size={40} style={tw`text-red-500`} />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw`z-10 top-40`}>
              {loading && <ActivityIndicator size="large" color="#000000" />}
            </View>

            <Text style={tw`text-red-600`}>{error}</Text>
            <View style={tw`w-full p-3 items-center`}>
              <TextInput
                placeholder="Brand"
                style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
                value={brand}
                onChangeText={(e) => setBrand(e)}
              />

              <TextInput
                placeholder="Coupon Code"
                style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
                value={code}
                onChangeText={(e) => setCode(e)}
              />

              <TextInput
                placeholder="Discount"
                style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
                value={discount}
                onChangeText={(e) => setDiscount(e)}
              />

              <TextInput
                placeholder="Minimum Amount"
                style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
                value={minAmount}
                onChangeText={(e) => setMinAmount(e)}
              />

              <TextInput
                placeholder="Expiry Date"
                style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
                value={expDate}
                onChangeText={(e) => setExpDate(e)}
              />

              <TextInput
                placeholder="Description"
                style={tw`border border-gray-400 bg-gray-100 p-3 m-1 w-full rounded-md`}
                value={description}
                onChangeText={(e) => setDescription(e)}
              />
            </View>
            <TouchableOpacity
              style={tw`p-3 w-2/4 bg-orange-400 rounded-md  `}
              onPress={() => handleAddCoupon()}
            >
              <Text style={tw`text-center font-bold`}>ADD COUPON</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={tw`p-3`}
            >
              <Text style={tw`text-xl `}>close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </>
  );
};

const BuyCoupoun = () => {
  const Tab = createMaterialTopTabNavigator();

  return <GetCoupon />;
};

export default BuyCoupoun;
