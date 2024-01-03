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
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { ScrollView, PinchGestureHandler, State } from "react-native-gesture-handler";

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

  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: (event) => {
      const screenWidth = Dimensions.get("window").width;
      const index = Math.round(translateX.value / screenWidth);

      translateX.value = withSpring(index * screenWidth, { velocity: event.velocityX });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <ScrollView style={tw`h-full`}>
      <View style={tw`flex items-center w-full`}>
        <PinchGestureHandler>
          <Animated.View style={[{ flexDirection: "row" }, animatedStyle]}>
            {data.map((item, index) => (
              <View key={index} style={{ width: Dimensions.get("window").width }}>
                <Image source={{ uri: item.imageUrl }} style={tw`aspect-3/4`} />
                <Text style={{ position: "absolute", bottom: 30, left: 10, color: "white", fontSize: 20, fontWeight: "bold" }}>{item.title}</Text>
              </View>
            ))}
          </Animated.View>
        </PinchGestureHandler>

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
