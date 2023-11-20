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

const Search = () => {
  const [image, setImage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect( ()=> {
    if(image == null){
      setInterval( () => {
        setRecommendations([]);
      }, 50000)
    }
  },[image])
  const pickImage = async () => {
    setLoading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
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
        "http://192.168.1.2:5000/recommend",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.recommendations);
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
    <ScrollView style={tw`h-full bg-red-200 top-8`}>
   

      <View style={tw`z-10 top-40`}>
        {loading && <ActivityIndicator size="large" color="#000000" />}
      </View>

      
      <View style={tw`flex items-center justify-center h-full `}>
      <Text
        style={tw`text-lg mb-auto font-bold text-center bg-blue-200 w-full`}
      >
        Search Product
      </Text>
        {image == null ? (
          <View
            style={tw`items-center justify-center bg-slate-300 w-full h-60`}
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
          <ImageBackground source={{ uri: image }} style={tw`w-full h-60`}>
            <TouchableOpacity
              style={tw`p-3 pt-1 ml-auto`}
              onPress={() => setImage(null)}
            >
              <Ionicons name={"close-circle-outline"} color={"white"} size={40} />
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
        {recommendations.length > 0 && (
          <View style={tw`flex gap-2`}>
            {/* <Text>Top 5 Recommendations:</Text> */}
            {decodedImages.map((rec, index) => (
              <Image key={index} source={{ uri: rec }} style={tw`h-54 w-50`} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Search;
