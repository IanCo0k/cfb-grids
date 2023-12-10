import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // Import any Firebase services you need

const firebaseConfig = {
    apiKey: "AIzaSyAdreRzDSZnBZqCZ21yyv80q8vQRv5dQb0",
    authDomain: "cfb-grids.firebaseapp.com",
    projectId: "cfb-grids",
    storageBucket: "cfb-grids.appspot.com",
    messagingSenderId: "1039307534466",
    appId: "1:1039307534466:web:15d09918f2a3305646049b",
    measurementId: "G-V6ZFJVRZGX"
  };


  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);


// Export the Firebase instance if needed
export default app;