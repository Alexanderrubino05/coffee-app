import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import getBlobFromUri from "../extensions/getBlobFromUri";
import Ionicons from "react-native-vector-icons/Ionicons";

// Firebase
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
//

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const navigation = useNavigation();
  const storage = getStorage();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        navigation.navigate("Home");
      }
    });

    return unsubscribe;
  }, []);

  const registerUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        uploadDataToFirestore(user);
      })
      .catch((error) => alert(error.message));
  };

  const uploadDataToFirestore = async (user) => {
    const filename = image.substring(image.lastIndexOf("/") + 1);
    const imageBlob = await getBlobFromUri(image);
    const storageRef = ref(storage, `users/${user.uid}/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);

    try {
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          // A full list of error codes is available at https://firebase.google.com/docs/storage/web/handle-errors
          setError(error);
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //Succesfully added image
            setDoc(doc(db, "users", user.uid), {
              createdAt: new Date(),
              email: email,
              image: downloadURL,
            });
          });
        }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const loginUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      className="justify-center items-center flex-1 bg-background"
      behavior="padding"
    >
      <View className="w-full items-center gap-5 p-10">
        <TouchableOpacity
          className="w-24 h-24 rounded-full bg-secondary justify-center items-center overflow-hidden mb-4"
          onPress={pickImage}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={28} color="gray" />
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text) => setEmail(text)}
          className="w-full justify-center items-center h-14 rounded-3xl border-white border-[1px] text-white px-4"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={(text) => setPassword(text)}
          className="w-full justify-center items-center h-14 rounded-3xl border-white border-[1px] text-white px-4 mb-4"
        />

        <TouchableOpacity
          onPress={registerUser}
          className="bg-accent w-full justify-center items-center h-14 rounded-3xl"
        >
          <Text className="text-white text-lg font-semibold">Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={loginUser}
          className="w-full justify-center items-center h-14 rounded-3xl border-accent border-[1px]"
        >
          <Text className="text-white text-lg font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
