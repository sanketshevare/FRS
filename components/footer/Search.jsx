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
import { Column } from "native-base";

const Search = () => {
  const [image, setImage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [explainations, setExplainations] = useState([]);
  const [textExplainations, setTextExplainations] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [colorNames, setColorNames] = useState({});

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
      allowsEditing: true,
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
      // console.log("metadata", textExplainations);

      setMetadata(response.data.metadata);
      setRecommendations(response.data.recommendations);
      console.log(recommendations);
      // Decode the images and pass the URL to handleTagData

      const decodedImages =
        response.data.recommendations.map(decodeBase64Image);
      handleTagData(decodedImages);
      setLoading(false);
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

  const handleTagData = async (decodedImages) => {
    setLoading(true);
    try {
      const newTagData = await Promise.all(decodedImages.map(async (imageUrl) => {
        const formData = new FormData();
        formData.append("image", {
          uri: imageUrl,
          name: "image.jpg",
          type: "image/jpg",
        });
        const response = await axios.post(
          "https://cloudapi.lykdat.com/v1/detection/tags",
          formData,
          {
            headers: {
              "x-api-key":
                "4b3f3e2a7c3220f3413c47613a6a0efea97d067401509de37d1b8dc0e513cf49",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.data;
      }));
      console.log(newTagData);
      setTagData(newTagData);
    } catch (error) {
      console.error(error.response);
    } finally {
      setLoading(false);
    }
  };
  
  const getColorName = (hexCode) => {
    return colorNames[hexCode] || "Unknown";
  };

  return (
    <ScrollView style={tw`h-full  w-full  `}>
      <View style={tw`flex items-center justify-center h-full`}>
        <Text
          style={tw`text-lg font-bold text-center bg-blue-200 w-full pt-3`}
        ></Text>
        <Text style={tw`text-2xl font-bold text-center bg-blue-200 w-full`}>
          {" "}
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
              <Ionicons name={"close-circle-outline"} color={"red"} size={40} />
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
                style={tw`mb-4 rounded-md border border-black p-1`}
              >
                <Image
                  source={{ uri: rec }}
                  style={tw`w-full h-60  rounded-md`}
                  resizeMode="cover"
                />

                {metadata && metadata[index] && (
                  <View style={tw`p-2 bg-slate-300 `}>
                    <Text style={tw`text-xl font-600 pl-1`}>
                      {metadata[index].product_name}
                    </Text>
                    <Text style={tw`text-lg font-500 pl-1`}>
                      {metadata[index].brand}{" "}
                    </Text>

                    {metadata[index].sales_price && (
                      <Text style={tw`text-lg font-500 pl-1`}>
                        Retail Price: {metadata[index].sales_price}{" "}
                        {metadata[index].currency}{" "}
                      </Text>
                    )}
                    {metadata[index].discount_percentage && (
                      <Text style={tw`text-base font-500 pl-1`}>
                        Discounted Price:
                        {metadata[index].discount_percentage}
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
                {tagData[index] && typeof tagData[index] === "object" && (
                  <View style={tw`bg-slate-300 p-2 w-full`}>
                    {/* <Text style={tw`font-bold text-lg mb-2`}>
                      Tag Data for Image {index + 1}:
                    </Text> */}
                    <Text style={tw`text-gray-800 mb-1 p-2`}>Colors:</Text>
                    <View style={tw`flex flex-row flex-wrap`}>
                      {tagData[index].colors.map((color, idx) => (
                        <View
                          key={idx}
                          style={tw`bg-slate-300 p-2 rounded-lg flex flex-row items-center mr-2 mb-2`}
                        >
                          <View
                            style={{
                              backgroundColor: `#${color.hex_code}`,
                              width: 20,
                              height: 20,
                              marginRight: 10,
                            }}
                          />
                          <Text>{color.name}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={tw`text-gray-800 mt-3 mb-1 pl-2`}>Items:</Text>
                    <View style={tw`flex flex-row flex-wrap`}>
                      {tagData[index].items.map((item, idx) => (
                        <View
                          key={idx}
                          style={tw`bg-slate-300 p-2 rounded-lg flex flex-row items-center mr-2 mb-2`}
                        >
                          <View style={tw`bg-blue-100 p-2 rounded-lg flex flex-row items-center`}>
                            <Text>{item.name}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <Text style={tw`text-gray-800 mt-3 mb-1 pl-2`}>Labels:</Text>
                    <View style={tw`flex flex-row flex-wrap`}>
                      {tagData[index].labels.map((label, idx) => (
                        <View
                          key={idx}
                          style={tw`bg-slate-300 p-2 rounded-lg flex flex-row items-center mr-2 mb-2`}
                        >
                          <View style={tw`bg-blue-300 p-2 rounded-lg flex flex-row items-center`}>
                            <Text>{label.name}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
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
                      style={tw`p-3 mb-2 bg-orange-400 w-full text-center rounded-md items-center justify-center`}
                    >
                      <TouchableOpacity>
                        <Text style={tw`text-white text-center font-bold`}>
                          View Product
                        </Text>
                      </TouchableOpacity>
                    </A>

                    <TouchableOpacity>
                        <Text style={tw`p-3 bg-red-900 w-full text-center rounded-md items-center justify-center text-white text-center font-bold`}>
                         Add to Wishlist
                        </Text>
                      </TouchableOpacity>
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
