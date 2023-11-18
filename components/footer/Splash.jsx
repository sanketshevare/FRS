import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import tw from "twrnc";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const data = [
  {
    title: "Fashion is the armor to survive the reality of everyday life.",
    imageUrl:
      "https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Style is a way to say who you are without having to speak.",
    imageUrl:
      "https://images.pexels.com/photos/1233648/pexels-photo-1233648.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Style is more about being yourself.",
    imageUrl:
      "https://images.pexels.com/photos/167703/pexels-photo-167703.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const windowWidth = Dimensions.get("window").width;
const sliderWidth = Dimensions.get("window").width + 80;
const itemWidth = Math.round(sliderWidth * 0.7);
const Splash = () => {
  const auth = getAuth();
  const navigation = useNavigation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const _renderItem = ({ item }) => {
    return (
      <View style={tw`flex items-center right-10 top-8`}>
        <Image source={{ uri: item.imageUrl }} style={tw`h-54 w-100`} />
        <Text style={tw`z-10 bottom-30 text-xl text-white font-bold`}>
          {item.title}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={tw`h-full bg-red-200`}>
     
      <View style={tw`flex items-center w-full bg-blue-100`}>
        <View style={tw`w-full`}>
          <Carousel
            data={data}
            renderItem={_renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            autoplay={true}
            autoplayInterval={5000} // Set the interval for auto-sliding (in milliseconds)
            loop={true} // Enable looping of carousel items
            layout="default"
          />
        </View>

        <View style={tw`bg-yellow-200 h-auto`}>
          {user ? (
            <>
              <Text>Hello There, {user.email}!</Text>
            </>
          ) : (
            <>
              <Text>Home</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text>Login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <Text style={tw`h-100`}></Text>
        <Text style={tw`h-100`}></Text>

        
      </View>
    </ScrollView>
  );
};

export default Splash;
