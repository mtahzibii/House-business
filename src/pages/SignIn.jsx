import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

function SignIn() {
  // Initialize show password visibility icon
  const [showPassword, setShowPassword] = useState(false);

  // Initialize Form Data as an object
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Set email and password from formData (Destructuring Method)
  const { email, password } = formData;

  // Set naviagation to variable
  const navigate = useNavigate();

  // On Change Fcuntion
  const onChange = async (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Submit sign-in form
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate("/profile");
        toast.success("Logged in succesfully");
      }
    } catch (error) {
      toast.error("Bad user Credentials");
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
          <div className='signInBar'>
            <p className='signInText'>Sign In</p>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
        <OAuth />

        <Link className='registerLink' to='/sign-up'>
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;
