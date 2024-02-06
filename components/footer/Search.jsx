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
  const [explainations, setExplainations] = useState([]);
  const [textExplainations, setTextExplainations] = useState([]);

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
        "http://192.168.0.105:8000/api/recommend",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "JWT " + accessToken,
          },
        }
      );
      // console.log(response.data.metadata);
      setTextExplainations(response.data.explanations);
      console.log("metadata", textExplainations);

      setMetadata(response.data.metadata);
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

  // const decodedExplaination = decodeBase64Image(
  //   textExplainations[0].explanation_encoded_image
  // );
  const decodedImages = recommendations.map(decodeBase64Image);

  // console.log("decodedExplaination" + decodedExplaination);

  return (
    <ScrollView style={tw`h-full  w-full  `}>
      <View style={tw`flex items-center justify-center h-full`}>
        <Text
          style={tw`text-lg font-bold text-center bg-blue-200 w-full pt-3`}
        ></Text>
        <Text style={tw`text-2xl font-bold text-center bg-blue-200 w-full`}> Search Product</Text>
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
              <Text style={tw`text-md`}>Pick Product Image From Gallery</Text>
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
                color={"red"}
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
            {loading == true ? (
              <View>
                <ActivityIndicator size="small" color="#000000" />
                <Text>This will take a moment...</Text>
              </View>
            ) : (
              <Text style={tw`font-bold`}>RECOMMEND ME</Text>
            )}
          </TouchableOpacity>
        )}

        {recommendations.length > 0 ? (
          <View style={tw`h-screen`}>
            <Text style={tw`text-center text-lg`}>Your Recommendations:</Text>

            {decodedImages.map((rec, index) => (
              <View
                key={index}
                style={tw`mb-2 border-gray-200 shadow-sm w-100`}
              >
                <Image
                  source={{ uri: rec }}
                  style={tw`w-full h-60  `}
                  resizeMode="contain"
                />

                {metadata && metadata[index] && (
                  <View style={tw`p-2 bg-slate-300`}>
                    <Text style={tw`text-xl font-600 pl-1`}>
                      {metadata[index].product_name}
                    </Text>
                    <Text style={tw`text-lg font-500 pl-1`}>
                      {metadata[index].brand}{" "}
                    </Text>

                    {metadata[index].currency && (
                      <Text style={tw`text-lg font-500 pl-1`}>
                        Retail Price: {metadata[index].sales_price}{" "}
                        {metadata[index].currency}{" "}
                      </Text>
                    )}
                    {metadata[index].discount_percentage && (
                      <Text style={tw`text-base font-500 pl-1`}>
                        Discounted Price:
                        {metadata[index].discount_percentage} OFF
                      </Text>
                    )}

                    {metadata[index].colour && (
                      <Text style={tw`text-base font-500 pl-1`}>
                        Colours:
                        {metadata[index].colour}
                      </Text>
                    )}
                  </View>
                )}

                {/* <Image
                  source={{ uri: decodedExplaination }}
                  style={tw`w-full h-60  `}
                  resizeMode="contain"
                /> */}

                {textExplainations && textExplainations[index] && (
                  <View style={tw`p-3 bg-slate-300`}>
                    <Text
                      style={tw`text-center text-gray-800 font-bold text-lg`}
                    >
                      Explainantions
                    </Text>
                    <Text style={tw`text-base text-gray-700 font-bold p-0.5`}>
                      Product {index + 1} (Label:{" "}
                      {textExplainations[index].label} ):
                      {metadata && metadata[index] && (
                        <Text>{metadata[index].product_name}</Text>
                      )}
                    </Text>

                    <Text
                      style={tw`text-base font-bold text-gray-600 text-justify p-0.5`}
                    >
                      We recommend these product because this belong to the '
                      {metadata && metadata[index] && (
                        <Text>{metadata[index].product_name}</Text>
                      )}
                      ' category (Label: {textExplainations[index].label}). The
                      recommendation is influenced by various factors, and one
                      important aspect is a specific feature represented by the
                      local prediction shape of approximately{" "}
                      {textExplainations[index].local_pred_shape}
                    </Text>
                    <A
                      href={metadata[index].product_url}
                      style={tw`p-3 bg-orange-400 w-full text-center rounded-md items-center justify-center`}
                    >
                      <TouchableOpacity>
                        <Text style={tw`text-white text-center font-bold`}>
                          View Product
                        </Text>
                      </TouchableOpacity>
                    </A>
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
