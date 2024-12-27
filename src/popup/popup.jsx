// import React from 'react';
// import {createRoot} from 'react-dom/client'
// import '../assets/tailwind.css'
// const test = (
//     <div>
//         <h1 className='text-sky-500 text-lg'>Hello, world!</h1>
//         <img src="hi.jpg" alt="hi"></img>
//     </div>
// )

// const container = document.createElement('div')
// document.body.appendChild(container)
// const root = createRoot(container)
// root.render(test)


import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Loginpage from './Loginpage.jsx';
import Dashboard from './Dashboard.jsx';
import Signup from './Signup.jsx';
import '../assets/tailwind.css';

const Popup = () => {
  const [page, setpage] = useState("signup");

  const [inputValue, setInputValue] = useState('');
  const [isloading, setisloading] = useState(false);
  console.log("hu")
  // Load the data from storage when the component mounts
  useEffect(() => {
    setisloading(true);
    chrome.storage.local.get(['token69'], (result) => {
      if(result.token69){
        chrome.runtime.sendMessage({ action: 'setToken', token69: result.token69}); 
        //console.log(result.token69)   
        setpage("dash");
      }
    });
    setisloading(false);
    
  }, []);

  return (
    <div className=''>
      {/* {isLoggedIn ? <Dashboard /> : <Loginpage onLogin={handleLogin} />} */}
      {page=="login"&& <Loginpage page = {page} setpage = {setpage}></Loginpage>}
      {page=="signup" && <Signup page = {page} setpage = {setpage}></Signup>}
      {page=="dash" && <Dashboard page = {page} setpage = {setpage}></Dashboard>}
      
      {/* <Signup></Signup> */}
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Popup />);
