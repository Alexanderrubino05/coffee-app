import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

//Firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export const CartScreen = () => {
  const navigation = useNavigation();
  const [cartProducts, setCartProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0.0);

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  //Delete Coffee Product
  const deleteProduct = async (id) => {
    const newCartProducts = cartProducts.filter((product) => {
      return product.id !== id;
    });
    setCartProducts(newCartProducts);

    await deleteDoc(doc(db, "users", auth.currentUser?.uid, "cart", id));
  };

  //Fetch Coffee Products
  useEffect(() => {
    getDocs(collection(db, "users", auth.currentUser?.uid, "cart")).then(
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartProducts(newData);
      }
    );
  }, []);

  //Get Sub Total
  useEffect(() => {
    let newSubTotal = 0.0;
    cartProducts.map(({ coffee }) => {
      newSubTotal += coffee.price;
    });
    setSubTotal(newSubTotal);
  }, [cartProducts]);

  //Handle Checkout
  const handleCheckout = () => {
    addDoc(collection(db, "orders"), {
      createdAt: new Date(),
      user: auth.currentUser?.uid,
      cart: cartProducts,
    });

    setCartProducts([]);
    cartProducts.map(({ id }) => {
      deleteDoc(doc(db, "users", auth.currentUser?.uid, "cart", id));
    });

    //Complete
    setCheckoutComplete(true);
    setTimeout(() => setCheckoutComplete(false), 2000);
  };

  return (
    <View className="bg-background flex-1 px-4 py-16 gap-y-6">
      {/* Top button */}
      <View className="flex-row items-center justify-center relative">
        <TouchableOpacity
          className="absolute left-0 bg-secondary rounded-xl p-2"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#EF8849" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-xl">My Cart</Text>
      </View>

      {/* List of products */}
      {cartProducts.length === 0 ? (
        <></>
      ) : (
        <ScrollView className="gap-y-4">
          {cartProducts.map(({ coffee, id }) => {
            const randomKey = Math.floor(Math.random() * 100);
            return (
              <View key={randomKey} className="flex-row gap-x-4 items-center">
                <Image
                  source={{ uri: coffee.image }}
                  className="w-32 h-32 rounded-2xl bg-secondary"
                />

                <View className="gap-y-1 flex-1">
                  <Text className="text-white text-xl font-medium">
                    {coffee.name}
                  </Text>

                  {/* Price */}
                  <View className="flex-row gap-x-1">
                    <Text className="text-accent text-base">$</Text>
                    <Text className="text-gray-600 text-base">{`${coffee.price}`}</Text>
                  </View>
                </View>

                {/* Delete */}
                <TouchableOpacity onPress={() => deleteProduct(id)}>
                  <Ionicons name="close" size={24} color="#EF8849" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Bottom end */}
      <View className="absolute gap-y-3 bottom-0 pb-16 left-0 right-0 px-4 bg-background z-50">
        <View className="flex-row justify-between w-full">
          <Text className="text-white text-base">Sub total</Text>
          <Text className="text-gray-600 text-base">
            ${`${subTotal.toFixed(2)}`}
          </Text>
        </View>

        <View className="flex-row justify-between w-full">
          <Text className="text-white text-base">Delivery fee</Text>
          <Text className="text-gray-600 text-base">$5.00</Text>
        </View>

        {/* Divider */}
        <View className="w-full h-[2px] bg-secondary" />

        {/* Total */}
        <View className="flex-row justify-between w-full mb-4">
          <Text className="text-white text-lg font-bold">Total</Text>
          <Text className="text-white text-lg font-bold">
            ${`${(subTotal + 5.0).toFixed(2)}`}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-accent justify-center items-center h-14 rounded-2xl"
          onPress={() => handleCheckout()}
        >
          <Text className="text-white font-medium text-lg">
            {checkoutComplete ? "Order complete" : "Checkout"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
