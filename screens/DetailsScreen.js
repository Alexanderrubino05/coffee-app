import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { addToCart } from "../utils/functions";

const sizes = ["Small", "Medium", "Large"];

export const DetailsScreen = ({ route }) => {
  const { coffee } = route.params;

  const navigation = useNavigation();
  const [selectedSize, setSelectedSize] = useState("Small");
  const [showCheckMark, setShowCheckMark] = useState(false);

  return (
    <View className="bg-background flex-1 h-20">
      <ScrollView className="px-4 pt-16 gap-y-4" contentInset={{ bottom: 80 }}>
        <View className="w-full h-[500px] relative rounded-[40px] overflow-hidden">
          {/* Top button */}
          <TouchableOpacity
            className="absolute top-4 left-4 z-10 bg-secondary rounded-xl p-2"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#EF8849" />
          </TouchableOpacity>

          <Image
            source={{ uri: coffee.image }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Bottom Part over image */}
          <View className="absolute w-full p-8 bg-black/25 bottom-0 rounded-3xl flex-row justify-between items-center">
            <Text className="text-white text-2xl font-medium">
              {coffee.name}
            </Text>

            <View className="bg-secondary py-2 px-4 rounded-lg">
              <Text className="text-white">With oatmilk</Text>
            </View>
          </View>
        </View>

        {/* Text */}
        <View className="gap-y-2">
          <Text className="text-gray-500 text-base">Description</Text>
          <Text className="text-white text-base">{coffee.description}</Text>
        </View>

        {/* Size pick */}
        <View className="gap-y-2">
          <Text className="text-gray-500 text-base">Size</Text>
          <View className="flex flex-row justify-around">
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                className={`bg-secondary w-[30%] py-2 justify-center items-center rounded-xl transition-all ${
                  size === selectedSize ? "border-accent border-2" : ""
                }`}
                onPress={() => setSelectedSize(size)}
              >
                <Text className="text-white text-lg font-medium">
                  {size.charAt(0)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Buy View */}
      <View className="pb-14 pt-4 px-4 justify-between flex-row items-center bg-secondary rounded-t-3xl">
        <View className="flex-row gap-x-1 items-center">
          <Text className="text-gray-500 text-base">Price: </Text>
          <Text className="text-accent text-xl">$</Text>
          <Text className="text-white text-xl">{coffee.price}</Text>
        </View>

        <TouchableOpacity
          className="bg-accent rounded-2xl w-1/2 justify-center items-center h-12"
          onPress={() => {
            addToCart(coffee);
            setShowCheckMark(true);
            setTimeout(() => setShowCheckMark(false), 2000);
          }}
        >
          {showCheckMark ? (
            <Ionicons name="checkmark" size={24} color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Add to cart
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
