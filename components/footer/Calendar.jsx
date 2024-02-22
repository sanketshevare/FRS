import React, { useState } from "react";
import tw from "twrnc";
import { useAuth } from "../../config/AuthContext";
import * as ImagePicker from "expo-image-picker";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import axios from "axios"; // Import axios for making HTTP requests
import { Ionicons } from "@expo/vector-icons";

const Calendar = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [tagData, setTagData] = useState([]);
  const [colorNames, setColorNames] = useState({});

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

  const handleTagData = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        name: "image.jpg",
        type: "image/jpg",
      });
      const response = await axios.post(
        "https://cloudapi.lykdat.com/v1/detection/tags",
        formData,
        {
          headers: {
            // Authorization: "JWT " + accessToken,
            "x-api-key": "dd23e965b85964d6e94c54896e9ea6d78c3d7b31f310e1807fb1ab897ac63ca5",
            "Content-Type": "multipart/form-data",

          },
        }
      );
      console.log(response.data.data);
      setTagData(response.data.data);
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
    <ScrollView>
      <View style={tw`flex items-center justify-center h-full`}>
        <Text
          style={tw`text-lg font-bold text-center bg-blue-200 w-full pt-3`}
        ></Text>
        <Text style={tw`text-2xl font-bold text-center bg-blue-200 w-full`}>
          {" "}
          Extract Product Detaills
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
            onPress={handleTagData}
          >
            {loading == true ? (
              <View>
                <ActivityIndicator size="small" color="#000000" />
                <Text>This will take a moment...</Text>
              </View>
            ) : (
              <Text style={tw`font-bold`}>EXTRACT IMAGE</Text>
            )}
          </TouchableOpacity>
        )}
        <View style={tw`p-2 w-full`}>
          {tagData.colors && (
            <View
              style={tw`p-3 bg-red-200 w-full border border-black rounded mb-1`}
            >
              <Text style={tw`text-base mb-1 font-bold`}>
                Colors found in image:
              </Text>
              {tagData.colors.map((color, index) => (
                <View style={tw`flex flex-row`} key={index}>
                  <Text
                    style={{
                      backgroundColor: `#${color.hex_code}`,
                      height: 10,
                      width: 10,
                      padding: 10,
                    }}
                  ></Text>
                  <Text style={tw`p-1 text-center `}>{color.name}</Text>
                </View>
              ))}
            </View>
          )}
          {tagData.items && (
            <View
              style={tw`p-3 bg-gray-200 w-full border border-black rounded mb-1`}
            >
              <Text style={tw`text-base mb-1 font-bold`}>
                Item/s present in image:
              </Text>
              {tagData.items.map((item, index) =>
                item.category === "clothing" ? (
                  <View style={tw`p-1`} key={index}>
                    <Text>
                      <Ionicons name={"shirt"} color={"red"} size={15} />{" "}
                      Category: {item.category}
                    </Text>
                    <Text style={tw`ml-6`}>Name: {item.name}</Text>
                  </View>
                ) : (
                  <View style={tw`p-1`} key={index}>
                    <Text>
                      <Ionicons name={"flash"} color={"black"} size={15} />{" "}
                      Category: {item.category}
                    </Text>
                    <Text style={tw`ml-6`}>Name: {item.name}</Text>
                  </View>
                )
              )}
            </View>
          )}
          {tagData.labels && (
            <View
              style={tw`p-3 bg-blue-200 w-full border border-black rounded`}
            >
              <Text style={tw`text-base mb-1 font-bold`}>
                Approximate labels found in image:
              </Text>
              {tagData.labels.map((label, index) => (
                <View style={tw`p-1`} key={index}>
                  <Text>
                    {" "}
                    <Ionicons name={"star"} color={"gray"} size={13} />{" "}
                    {`Name: ${label.name}, Class: ${label.classification}`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        {loading && <ActivityIndicator size="large" color="#000000" />}
      </View>
    </ScrollView>
  );
};

export default Calendar;
