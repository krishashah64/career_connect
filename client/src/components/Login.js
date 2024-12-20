import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSignUpClicked, userLoggedIn, addLoggedInUser } from '../utils/userSlice';

const Login = () => {

  const email = useRef();
  const password = useRef();
  const fullname = useRef();
  const phoneNo = useRef();
  const profileType = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedIn = useSelector(store => store.users.loggedIn);
  const signUpClicked = useSelector(store => store.users.signUpClicked);
   

  // useEffect(() => {
      
  // });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log(e);
    console.log("Submit Clicked!");
    dispatch(setSignUpClicked(false));
    
    if(!signUpClicked){
      //login Logic
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Correct capitalization for the header
          },
          body: JSON.stringify({ 
            email: email.current.value,  // Send the value of the email input
            password: password.current.value // Send the value of the password input
          }), // Ensure email and password are defined
        });
    
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const jsonData = await response.json(); // Parse JSON response
        console.log(jsonData); 
        dispatch(userLoggedIn(true));
        dispatch(addLoggedInUser(jsonData.user));
        
        navigate("/");
        // Handle the response
      } catch (error) {
        console.error("Error:", error); // Log any errors
      }
    }
    else{
      //Sign Up Logic
      try{
        const response = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Correct capitalization for the header
          },
          body: JSON.stringify({
            name: fullname.current.value,
            // phoneNo: phoneNo.current.value,
            email: email.current.value,
            password: password.current.value, 
            profile_type: profileType.current.value, 
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json(); // Parse JSON response
        console.log(jsonData); 
        dispatch(userLoggedIn(true));
        dispatch(addLoggedInUser(jsonData.user));
        navigate("/");

      } catch (error){
        console.error("Error:", error);
      }
    }
   
  };
  
  const toggleSignIn = () => {
    dispatch(setSignUpClicked(!signUpClicked));
  }

  return (

    <div className="flex items-center justify-center py-24">
      <div className="w-1/4 p-6 bg-white shadow-md rounded-lg">

        <div className="text-2xl font-bold mb-4 text-center"> {signUpClicked ? "Sign Up" : "Login"}</div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {signUpClicked && 
            
              <div>
                <label className="block text-left">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your Full name"
                  className="border-2 w-full p-2 rounded-md"
                  ref={fullname}
                />
              </div>
          } 
          {/* {signUpClicked && 
                <div>
                  <label className="block text-left">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Enter Contact Number"
                    className="border-2 w-full p-2 rounded-md"
                    ref={phoneNo}
                  />
                </div>     
          } */}
          <div>
            <label className="block text-left">Email Address</label>
            <input
              type="text"
              placeholder="Enter email address"
              className="border-2 w-full p-2 rounded-md"
              ref={email}
            />
          </div>

          <div>
            <label className="block text-left">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="border-2 w-full p-2 rounded-md"
              ref={password}
            />
          </div>

          {signUpClicked && 
            
            <div>
              <label className="block text-left">Profile Type</label>
              <input
                type="text"
                placeholder="Job Seeker/ Employer"
                className="border-2 w-full p-2 rounded-md"
                ref={profileType}
              />
            </div>
        } 

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-2 rounded-md mt-4"
          >
            {signUpClicked ? "Sign Up" : "Login"}
          </button>

          <p 
            type="Submit" 
            onClick={toggleSignIn}
          > 
              {signUpClicked ? "Already user? Login" : "New user? Sign up"}
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login;