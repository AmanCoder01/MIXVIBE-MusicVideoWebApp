
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCqevo5B_djJ6vcPGfiHNS-2cAkUmNk_aM",
    authDomain: "podcast-df540.firebaseapp.com",
    projectId: "podcast-df540",
    storageBucket: "podcast-df540.appspot.com",
    messagingSenderId: "186403795865",
    appId: "1:186403795865:web:7a759fa1bba7ff8e259908"
};



export const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;

