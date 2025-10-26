
// js/firebase-config.js - modular export
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCftw-AGvhXzQROBHCpvumcqkRgGOOCv8g",
  authDomain: "transpote-guaiuba.firebaseapp.com",
  databaseURL: "https://transpote-guaiuba-default-rtdb.firebaseio.com",
  projectId: "transpote-guaiuba",
  storageBucket: "transpote-guaiuba.firebasestorage.app",
  messagingSenderId: "340107181463",
  appId: "1:340107181463:web:38845761b8d2179935d8d2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
