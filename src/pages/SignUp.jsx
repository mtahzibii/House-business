import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import OAuth from "../components/OAuth";

function SignUp() {
  // Initialize show password visibility icon
  const [showPassword, setShowPassword] = useState(false);

  // Initialize Form Data as an object
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Extract sub-data from formData object (Destructuring Method)
  const { name, email, password } = formData;

  // Set navigation to variable
  const navigate = useNavigate();

  // On Change Fcuntion
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // On Submit Function
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      // Update User Profile
      updateProfile(auth.currentUser, { displayName: name });

      // Make a copy of form data
      const formDataCopy = { ...formData };

      // Exclude password (not to save in DB)
      delete formDataCopy.password;

      // Add timestam to form data object
      formDataCopy.timestamp = serverTimestamp();

      // Submit data to database
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      // Navigate to home page
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with registration");
    }
  };

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>
        <form onSubmit={onSubmit}>
          <input
            className='nameInput'
            type='name'
            placeholder='Name'
            id='name'
            value={name}
            onChange={onChange}
          />
          <input
            className='emailInput'
            type='email'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />
          <div className='passwordInputDiv'>
            <input
              className='passwordInput'
              type={showPassword ? "text" : "password"}
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />
            <img
              className='showPassword'
              src={visibilityIcon}
              alt='show password'
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          <Link className='forgotPasswordLink' to='/forgot-password'>
            Forgot Password
          </Link>
          <div className='signUpBar'>
            <p className='signUpText'>Sign Up</p>
            <button className='signUpButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
        <OAuth />

        <Link className='registerLink' to='/sign-in'>
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;
