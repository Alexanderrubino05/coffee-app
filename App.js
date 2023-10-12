import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { DetailsScreen } from "./screens/DetailsScreen";
import { handleSignOut } from "./utils/functions";
import { CartScreen } from "./screens/CartScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ route, navigation }) => ({
            title: "",
            headerShown: true,
            headerStyle: { backgroundColor: "#111111" },
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.push("Cart")}>
                <Ionicons name="cart-outline" size={28} color="#EC8C6F" />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => handleSignOut(navigation)}>
                <Ionicons name="settings-outline" size={24} color="gray" />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Detail"
          component={DetailsScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>

      <StatusBar style="light" />
    </NavigationContainer>
  );
}
