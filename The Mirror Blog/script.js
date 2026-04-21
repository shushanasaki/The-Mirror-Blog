/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; 


/* === FIREBASE SETUP === */
const firebaseConfig = {
  apiKey: "AIzaSyBMQ7hPGYxZQoZV4-U52nlfd9vamxbXRgk",
  authDomain: "themirrorblog-f58b0.firebaseapp.com",
  projectId: "themirrorblog-f58b0",
  storageBucket: "themirrorblog-f58b0.firebasestorage.app",
  messagingSenderId: "859971398783",
  appId: "1:859971398783:web:478f900ec46f7ffb20e34a",
  measurementId: "G-HP1LYCCLQB"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

/* === UI === */


/* == UI - Elements == */
const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")
const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")
const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("sign-up-btn")
const signOutButtonEl = document.getElementById("sign-out-btn")
const userProfilePictureEl = document.getElementById("user-profile-picture")
const userGreetingEl = document.getElementById("user-greeting")
const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")
const teaPartyEl = document.getElementById("tea-party-posts")
const refreshButton = document.getElementById("refresh-btn")

/* == UI - Event Listeners == */
signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)
signOutButtonEl.addEventListener("click", authSignOut)
postButtonEl.addEventListener("click", postButtonPressed)
refreshButton.addEventListener("click", getPostFromDB)


/* === Main Code === */
authFunction();

function authFunction() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        showLoggedInView();
        const uid = user.uid;
        showProfilePicture(userProfilePictureEl, user);
        showUserGreeting(userGreetingEl, user);
                // ...
      } else {
        // User is signed out
        // ...
        showLoggedOutView();
      }
    });
}

async function showProfilePicture(imgElement, user) {
    const auth = getAuth();
    if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;
        const pfp = await displayImage();
        imgElement.src = URL.createObjectURL(pfp)
        const emailVerified = user.emailVerified;
    
        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;
        console.log(user.uid)
    }
 }

 async function displayImage() { 
    const response = await fetch('https://unsplash.it/1920/1080?random'); 
    const blob = await response.blob(); 
    return blob; 
 }
 
 function showUserGreeting(element, user) {
        const auth = getAuth();
        if (user !== null) {
            console.log(user.displayName);
          // The user object has basic properties such as display name, email, etc.
          if (user.displayName){
            element.textContent = "Hi " + user.displayName;
          }
          else {
            element.textContent = "Hey friend, how are you?";
          }
          const email = user.email;
          const photoURL = user.photoURL;
          const emailVerified = user.emailVerified;
        
          // The user's ID, unique to the Firebase project. Do NOT use
          // this value to authenticate with your backend server, if
          // you have one. Use User.getToken() instead.
          const uid = user.uid;
        }
 }


/* === Functions === */

function authSignInWithEmail() {
    console.log("Sign in with email and password")
    const auth = getAuth();
    const email = emailInputEl.value; 
    const password = passwordInputEl.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        showLoggedInView();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
}

/* Create account with email */
function authCreateAccountWithEmail() {
    console.log("Sign up with email and password")
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        showLoggedInView();
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}

function authSignOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
        showLoggedOutView();
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        
    });
}

async function addPostToDB(postBody, user) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      body: postBody,
      uid: user.uid
    });
    console.log("Document written with ID: {documentID}");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getPostFromDB() {
  teaPartyEl.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "posts"));
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    let postBox = document.createElement("div")
    let userName = document.createElement("h3")
    let body = document.createElement("p")
    body.textContent = doc.data().body;
    postBox.append(body);
    teaPartyEl.appendChild(postBox)
  });
}

/* == Functions - UI Functions == */
function showLoggedOutView() {
hideView(viewLoggedIn)
showView(viewLoggedOut)
}


function showLoggedInView() {
hideView(viewLoggedOut)
showView(viewLoggedIn)
}


function showView(view) {
view.style.display = "flex"
}


function hideView(view) {
view.style.display = "none"
}

function postButtonPressed() {
  const postBody = textareaEl.value
  const auth = getAuth();
  const user = auth.currentUser
 
  if (postBody) {
      addPostToDB(postBody, user)
      textareaEl.value = " "
  }
}