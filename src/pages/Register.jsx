import { auth, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Link } from "react-router-dom";
import AddAvatar from "../img/addAvatar.png";
import { useState } from "react";

function Register() {
  const [err, setErr] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Create User
      const res = await createUserWithEmailAndPassword(auth, email, password)

      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef)
            .then(async (downloadURL) => {
              try {
                // Update profile
                await updateProfile(res.user, {
                  displayName,
                  photoURL: downloadURL,
                })
              } catch (error) {
                setErr(true);
                console.error(error.message);
              }
            })
        })

    } catch (error) {
      setErr(true);
      console.error(error.message);
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className="title">
          <span className="logo">Deric Chat</span>
          <span className="subtitle">Register</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Display name" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
          {err && <span className="error-auth">Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register;