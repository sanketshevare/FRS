import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useAuth } from "../../config/AuthContext";
import { A } from "@expo/html-elements";

const Search = () => {
  const [image, setImage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [metadata, setMetadata] = useState({});

  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const { accessToken } = useAuth();

  // console.log("MYTOKEN: " + accessToken);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is logged in
        // navigation.navigate("Home");
        setRecommendations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect( ()=> {
  //   if(image == null){
  //     setInterval( () => {
  //       setRecommendations([]);
  //     }, 50000)
  //   }
  // },[image])

  const pickImage = async () => {
    setLoading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "image.jpg",
    });

    try {
      const response = await axios.post(
        // "http://64.227.147.139:8000/api/recommend",
        // "http://192.168.1.7:8000/api/recommend",
        "http://192.168.0.101:8000/api/recommend",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "JWT " + accessToken,
          },
        }
      );
      // console.log(response.data.metadata);
      setMetadata(response.data.metadata);
      console.log("metadata", metadata);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  function decodeBase64Image(base64String) {
    return `data:image/png;base64,${base64String}`;
  }

  const decodedImages = recommendations.map(decodeBase64Image);

  return (
    <ScrollView style={tw`h-full top-4 w-full p-1 mb-10`}>
      <View style={tw`z-30 sticky top-3`}>
        {loading && <ActivityIndicator size="large" color="#000000" />}
      </View>

      <View style={tw`flex items-center justify-center h-full`}>
        <Text
          style={tw`text-lg font-bold text-center bg-blue-200 w-full h-8 p-1`}
        >
          Search Product
        </Text>
        {image == null ? (
          <View
            style={tw`items-center justify-center bg-slate-300 w-full h-60 `}
          >
            <TouchableOpacity style={tw`items-center`}>
              <Ionicons
                name={"add-circle-outline"}
                color={"white"}
                size={90}
                onPress={pickImage}
              />
              <Text style={tw`text-md`}>Pick Product Image From Galary</Text>
            </TouchableOpacity>
            {/* <Button title="Pick an image from gallery" onPress={pickImage} /> */}
          </View>
        ) : (
          <ImageBackground
            source={{ uri: image }}
            style={tw`w-full h-100`}
            resizeMode="cover"
          >
            <TouchableOpacity
              style={tw`p-3 pt-1 ml-auto`}
              onPress={() => setImage(null)}
            >
              <Ionicons
                name={"close-circle-outline"}
                color={"black"}
                size={40}
              />
            </TouchableOpacity>
          </ImageBackground>
        )}
        {image && (
          // <Button title="Get Recommendations" onPress={getRecommendations} />
          <TouchableOpacity
            style={tw`bg-blue-300 p-3 w-1/2 m-3 rounded-lg items-center justify-center`}
            onPress={getRecommendations}
          >
            <Text style={tw`font-bold`}>Recommend Me</Text>
          </TouchableOpacity>
        )}

        {recommendations.length > 0 ? (
          <View style={tw`h-screen`}>
            <Text style={tw`text-center text-lg`}>Your Recommendations:</Text>

            {decodedImages.map((rec, index) => (
              <View
                key={index}
                style={tw`mb-2 border-2 border-black p-1 shadow-md`}
              >
                <Image
                  source={{ uri: rec }}
                  style={tw`w-full h-60  `}
                  resizeMode="contain"
                />

                {metadata && metadata[index] && (
                  <View style={tw``}>
                    <Text style={tw``}>
                      {metadata[index].product_name} {" | "} Brand:{" "}
                      {metadata[index].brand}{" "}
                    </Text>

                    {metadata[index].currency && (
                      <Text>
                        Retail Price:{metadata[index].sales_price}{" "}
                        {metadata[index].currency}{" "}
                      </Text>
                    )}
                    {metadata[index].discount_percentage && (
                      <Text>
                        Discounted Price:
                        {metadata[index].discount_percentage} OFF
                      </Text>
                    )}

                    {metadata[index].colour && (
                      <Text>
                        Colours:
                        {metadata[index].colour}
                      </Text>
                    )}

                    <Text>
                      View Product:{" "}
                      <A
                        style={tw`text-blue-600`}
                        href={metadata[index].product_url}
                      >
                        {metadata[index].product_url}
                      </A>
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={tw`flex items-center justify-center h-100`}>
            <Text style={tw`text-gray-400`}>
              Your Recommendations will appear here!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Search;
