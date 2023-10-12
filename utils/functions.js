import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const addToCart = (coffee) => {
  const uid = auth.currentUser.uid;
  if (uid === null) return;

  try {
    addDoc(collection(db, "users", uid, "cart"), {
      coffee: coffee,
    });
  } catch (error) {
    console.log(error, "Something went wrong");
  }
};

const handleSignOut = (navigation) => {
  signOut(auth)
    .then(() => {
      navigation.replace("Login");
    })
    .catch((error) => alert(error.message));
};

export { handleSignOut, addToCart };
