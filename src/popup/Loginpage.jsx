import React from "react";

// export default function Loginpage(){
//     return <div>
//         this is login page
//     </div>
// }

import axios from "axios";
import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
//import { BottomWarning } from "../components/BottomWarning";
//import { Button } from "../components/Button";
//import { Heading } from "../components/Heading";
//import { InputField } from "../components/InputField";
//import { SubHeading } from "../components/SubHeading";
//import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
//import { todos } from "../store/atoms/todos";
//import { info } from "../store/atoms/userinfo";
//import { Link } from "react-router-dom"

export default function Loginpage({ page, setpage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading state
  //const navigate = useNavigate();

  const handleSignIn = () => {
    //console.log("hi backend");
    setLoading(true); // Set loading state to true when sign-in button is clicked
    axios
      .post("https://extensionbackend.hamdidcarel.workers.dev/signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.message == "no user found") {
          alert(response.data.message);
          //console.log(response.data.message)
        }else{
          const authToken = response.data.token;
        //localStorage.setItem("token69", response.data.token);
          chrome.storage.local.set({ token69: authToken }, () => {
            console.log("Token saved in storage.", authToken);
          });
          chrome.runtime.sendMessage({ action: "setToken", token69: authToken });
          console.log(response.data.token);
          setpage("dash");
        }
        
        //navigate(`/dashboard`);
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading state back to false when request completes
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      //navigate("/dashboard")
    }
  }, []);

  return (
    <div className="h-screen bg-slate-300 flex justify-center overflow-hidden">
      <div className="flex flex-col justify-center">
        <div className="w-80 rounded-xl pt-3 pb-1 ">
          <div className="flex justify-between">
            <div></div>
          </div>
          <div className="p-4 pt-3 pb-3">
            <h1
              style={{ fontWeight: 650 }}
              className=" text-center font-sans  leading-tight text-[30px] smd:text-[39px] text-black text-opacity-80"
            >
              Sign in
            </h1>
            <h1
              style={{ fontWeight: 100 }}
              className=" text-center font-sans  leading-tight text-[15px] smd:text-[20px] text-black text-opacity-80"
            >
              Dont have an account{" "}
              <button
                onClick={() => {
                  setpage("signup");
                }}
                style={{ fontWeight: 250 }}
                className="text-blue-600 underline"
              >
                Sign up
              </button>
            </h1>
          </div>
          <div className="pt-2 text-center pl-3 pr-3">
            {/* <SubHeading SubHeading={"Enter your information to sign in "} /> */}
            <h2>Enter your information to sign in</h2>
          </div>

          <div className="flex justify-center">
            <div className="pt-2 text-center pl-3 pr-3 ">
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                type="text"
                className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 mb-2"
                placeholder="Email"
                required
              />

              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 "
                placeholder="*********"
                required
              />
            </div>
          </div>

          <div className="pl-3 mt-4 pr-3 flex justify-center">
            <button
              className={`bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[16px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSignIn}
            >
              Sign in
            </button>
          </div>
          <div className="pb-2"></div>

          {loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="text-white">Loading...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// function InputField({label,holder,onChange,type,value}){
//   return (
//       <div className="m-3">
//           <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
//           <input value={value || ""} onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={holder} required />
//       </div>
//   )
// }
