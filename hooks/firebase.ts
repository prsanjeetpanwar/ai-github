// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADq5LSzNe56D27TzPv_qhewAMpFPGzefE",
  authDomain: "dionysus-eeeaf.firebaseapp.com",
  projectId: "dionysus-eeeaf",
  storageBucket: "dionysus-eeeaf.appspot.com", // Corrected URL
  messagingSenderId: "938410175324",
  appId: "1:938410175324:web:39db989c0e1e6c6d132f99",
  measurementId: "G-K7JMWV60WH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only if supported and on the client side
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    } else {
      console.warn("Analytics is not supported in this environment.");
    }
  });
}

// Export storage
export const storage = getStorage(app);

// File upload function
export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void
) {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log('Upload Progress:', progress); // Add this line
          console.log('Bytes Transferred:', snapshot.bytesTransferred);
          console.log('Total Bytes:', snapshot.totalBytes);
      

          if (setProgress) setProgress(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
