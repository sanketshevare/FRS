import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import tw from "twrnc";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { A } from "@expo/html-elements";
import RNPickerSelect, {
  defaultStyles,
  pickerSelectStyles,
  inputAndroid,
  inputIOS,
} from "react-native-picker-select";
// import SkeletonContent from "react-native-skeleton-content";

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

  const [blogs, setBlogs] = useState([]);
  const [selectedCity, setSelectedCity] = useState("london");
  const [loading, setLoading] = useState(false);

  const placeholder = {
    label: "Browse by city",
    value: "london",
  };



  const getBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://chicmi.p.rapidapi.com/calendar_in_city/",
        {
          params: {
            city: selectedCity,
            days: "500",
            max_results: "50",
          },
          headers: {
            "X-RapidAPI-Key":
              "8dfe0ada5dmsh823e94c62ea45b9p1d307fjsnf51e2c2191c1",
            "X-RapidAPI-Host": "chicmi.p.rapidapi.com",
          },
        }
      );

      // console.log(
      //   "Chicmi API Response mbjsfj,kge   :",
      //   response.data.values.events[0]
      // );
      setBlogs(response.data.values.events);
      setLoading(false);
      // console.log("blogs" + blogs[0].summary_en);
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    getBlogs();
  }, [selectedCity]);

  // const options = {
  //   method: 'GET',
  //   url: 'https://chicmi.p.rapidapi.com/calendar_in_city/',
  //   params: {
  //     city: 'london',
  //     days: '5',
  //     max_results: '3'
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': '8dfe0ada5dmsh823e94c62ea45b9p1d307fjsnf51e2c2191c1',
  //     'X-RapidAPI-Host': 'chicmi.p.rapidapi.com'
  //   }
  // };

  // try {
  // 	const response = axios.request(options);
  // 	console.log(response.data);
  // } catch (error) {
  // 	console.error(error);
  // }

  const _renderItem = ({ item }) => {
    return (
      <View style={tw`flex items-center right-10 top-4`}>
        <Image
          source={{ uri: item.imageUrl }}
          style={tw`h-80 aspect-video w-100`}
        />
        <Text style={tw`z-10 absolute top-50 text-xl text-white font-bold`}>
          {item.title}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={tw`h-auto`}>
      <View style={tw`flex items-center w-full`}>
        <View style={tw`w-full`}>
          <Carousel
            data={data}
            renderItem={_renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            autoplay={true}
            autoplayInterval={5000} // Set the interval for auto-sliding (in milliseconds)
            loop={true} // Enable looping of carousel items
            layout="stack"
          />
        </View>

        <View style={tw`z-20 absolute top-98`}>
          {loading && <ActivityIndicator size="xl" color="#fff" />}
        </View>
        <Text
          style={tw`text-center text-lg text-slate-700 p-1 bg-red-100 w-full`}
        >
          Browse Events By City
        </Text>
        <View style={tw``}>
          <RNPickerSelect
            placeholder={placeholder}
            items={[
              { label: "London", value: "london" },
              // { label: "Miami", value: "miami" },
              { label: "Chicago", value: "chicago" },
              
            ]}
            onValueChange={(value) => setSelectedCity(value)}
            // useNativeAndroidPickerStyle={false}
            value={selectedCity || "london"}
            style={{
              inputIOS: {
                backgroundColor: "gray",
                color: "white",
                width: 400,
                textAlign: "center",
              },
              inputAndroid: {
                backgroundColor: "gray",
                color: "white",
                width: 400,
                textAlign: "center",
              },
            }}
          />
        </View>

        <View style={tw`h-auto w-full `}>
          {blogs.map((blog, index) => (
            <View key={index}>
            <View  style={tw`w-full p-2 bg-gray-900 `}>
              <Text style={tw`text-center text-lg font-bold text-white`}>
                {blog.event_name}
              </Text>

              <Image
                source={{ uri: blog.event_card_url }}
                style={tw`h-70 w-100`}
              />

              <Text style={tw` text-justify text-md text-white`}>
                {blog.summary}
              </Text>

              <Text style={tw` text-justify text-md text-white`}>
                <Text style={tw`font-bold`}>Address:</Text>{" "}
                {blog.formatted_address}
              </Text>

              <Text style={tw` text-justify text-md text-white`}>
                <Text style={tw`font-bold`}>Views: </Text>{" "}
                {blog.page_views_total}
                {"                                   "}
                <Text style={tw`font-bold`}>Start Date:</Text> {blog.start_date}
              </Text>

              <Text style={tw` text-md text-white`}>
                <Text style={tw`font-bold`}>Visit Us:</Text>{" "}
                <A href={blog.persona.url}>{blog.persona.url}</A>
              </Text>
            </View>
            <View style={tw`mb-px w-full bg-gray-100`}/>
            </View>
            
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Splash;
