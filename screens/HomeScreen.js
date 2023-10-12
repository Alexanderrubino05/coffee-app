import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

//Firebase
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { addToCart } from "../utils/functions";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [coffees, setCoffees] = useState([]);
  const [showCheckMark, setShowCheckMark] = useState(false);

  const transitionToDetailsScreen = (coffee) => {
    navigation.push("Detail", {
      coffee: coffee,
    });
  };

  const fetchData = () => {
    //Coffee Fetch
    getDocs(query(collection(db, "coffee"), orderBy("index"))).then(
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCoffees(newData);
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FlatList
      className="p-4 bg-background"
      data={coffees}
      contentContainerStyle={{ rowGap: 40, paddingBottom: 60 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="relative bg-secondary rounded-2xl overflow-hidden"
          onPress={() => transitionToDetailsScreen(item)}
        >
          {/* Add button */}
          <TouchableOpacity
            className="p-2 bg-accent rounded-xl absolute right-3 top-3 z-50"
            onPress={() => {
              addToCart(item);
              setShowCheckMark(true);
              setTimeout(() => setShowCheckMark(false), 2000);
            }}
          >
            {showCheckMark ? (
              <Ionicons name="checkmark" size={24} color="white" />
            ) : (
              <Ionicons name="add" size={24} color="white" />
            )}
          </TouchableOpacity>

          <Image
            source={{ uri: item.image }}
            className="w-full h-80 p-2 rounded-2xl"
          />

          <View className="p-4 gap-y-3">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-white text-xl font-medium">
                {item.name}
              </Text>

              {/* Price */}
              <View className="flex-row gap-x-1">
                <Text className="text-accent text-lg">$</Text>
                <Text className="text-white text-lg">{`${item.price}`}</Text>
              </View>
            </View>

            <Text className="text-gray-500" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListHeaderComponent={() => (
        <Text className="text-4xl font-semibold text-white">
          Find the best coffee for you
        </Text>
      )}
    />
  );
};

export default HomeScreen;
