import React from 'react';
import { useState, useEffect } from "react"
import axios from "axios"
//import { useNavigate } from "react-router-dom"
//import { Link } from "react-router-dom"
//import designImage from "../images/Design.jpg";

export default function Signup({page,setpage}) {
    const [verified, setVerified] = useState(false)
    const [codematch, setCodematch] = useState(false);
    const [firstName, setFirstName] = useState("")
    const [verifytry, setVerifytry] = useState(0)
    const [username, setUsername] = useState("")
    const [verifyCode, setVerifyCode] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    // const navigate = useNavigate()

 
    useEffect(()=>{
        const token  = localStorage.getItem("token");
        if(token){
        //navigate("/dashboard")
        }
    },[])

    return (
        <div className=''>
            <div className="bg-gray-100 min-h-screen ">
      {/* Top Bar Section */}
      <div className="h-screen bg-white  pb-2">
      
        <div className=''>
        <div className='flex'>
          <div className='w-full flex justify-center'>
          <div className='flex'>
          
          {/* <img className="h-7 w-7 mt-4" src="hi.jpg" alt="Design" /> */}
          
          <span className='font-sans text-3xl font-bold mt-3 text-gray-500' >
          TabNest
          </span>
          </div>
          </div>
          </div>
        <nav>
          <ul className="flex space-x-1 md:space-x-4">
            {/* <li><Link to="/signin"  className="  text-black text-opacity-70 py-[15px] rounded-md transition duration-300  font-semibold border-none text-md"> Sign in</Link></li> */}
            {/* <li><Link to="/signin" className="bg-blue-500 hover:bg-blue-600 text-white  py-2 px-2 md:py-2 md:px-4 rounded-lg transition duration-300 text-xs ">Sign In</Link></li> */}
          </ul>
        </nav>
        </div>
        
        
        
        
        <br className={`${codematch?"hidden":""}`}A></br>
        <div className='flex justify-center'>
          <div style={{ width: '90vw' }} className='flex justify-center'>
          <div className="mx-auto">
            <div className="max-w-5xl mx-auto mt-5">
                <div className="max-w-2xl text-center mx-auto p-3">
                    <p style={{ fontWeight: 650 }} className=' text-center font-sans  leading-tight text-[30px] smd:text-[39px] text-black text-opacity-80'>
                    Never Loose your Tabs again with TabNest
                    </p>
                    <p style={{ fontWeight: 650 }} className='mt-3 text-center font-sans  leading-tight text-[15px]  text-black text-opacity-80'>
                    Already have a TabNest Account? <button onClick={()=>{
                        setpage("login")
                    }} style={{ fontWeight: 350 }} className='text-blue-600 underline'>Sign in</button>
                    </p>
                </div>
                <div className={`text-center ${codematch?"mt-3":"mt-10"} mx-5 `}>
                    <label for="first_name" className="block mb-2  font-medium text-gray-900 ">Email</label>
                    <div className="w-full flex justify-center">
                        <input onChange={(e)=>{
                            setUsername(e.target.value)
                        }} type="text"  className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 ${
                            loading || verified || codematch ? "opacity-50 cursor-not-allowed" : ""
                          }`  } placeholder="John@gmail.com" required />
                    </div>
                    <br className={`${codematch?"hidden":""}`}></br>
                    
                    {!verified &&<button onClick={async()=>{
                        if( username==""){
                            alert("fill all the credentials")
                        }
                        else{
                            console.log(username)
                            setLoading(true)
                            setVerifytry(x=>x+1);
                        try {
                            const response = await axios.post("https://extensionbackend.hamdidcarel.workers.dev/varification", {
                                email:username.trim()
                            })
                            if(response.data.success == true){
                                console.log(response.data)
                                setVerified(true);
                                

                            }
                            setLoading(false)
                            

                            //localStorage.setItem("token", response.data.token)
                            //setTodoList(response.data.res.todo);
                            // setInfo({
                            //     name:response.data.res.name,
                            //     username:response.data.res.username,
                            //     id:response.data.res.id
                                
                            // })
                            //navigate(`/dashboard`)
                        } catch (error) {
                            console.error("Error during signup", error)
                        } finally {
                            setLoading(false)
                        }
                        }
                    }} className={`bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[16px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                        loading || verified ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading || verified}>
                    {!loading && <p>{verifytry>0 &&<p>Try again</p>}{verifytry==0 &&<p>Send verification code</p>}</p>}
                    {loading && <p>Loading..</p>}
                </button>}
                {verified && !codematch && <div>
                    <div>
                        Verification code is sent to your mail
                    </div>
                    <div>
                    <label for="first_name" className="block mb-2  font-medium text-gray-900 ">Enter 4 digit code</label>
                    <div className="w-full flex justify-center">
                        <input onChange={(e)=>{
                            setVerifyCode(e.target.value)
                        }} type="text"  className=" w-[100px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 " placeholder="" required />
                    </div>
                        
                    </div >
                    {!codematch &&<button onClick={async()=>{
                        if( username==""){
                            alert("please enter the code")
                        }
                        else{
                            console.log(username)
                            setLoading(true)
                            setVerifytry(x=>x+1);
                        try {
                            const response = await axios.post("https://extensionbackend.hamdidcarel.workers.dev/varifycode", {
                                email:username.trim(),
                                code:verifyCode.trim()
                            })
                            if(response.data.success == true){
                                console.log(response.data)
                                setCodematch(true);

                            }else{
                                setVerified(false);
                                setCodematch(false);
                            }
                            setLoading(false)
                            

                            //localStorage.setItem("token", response.data.token)
                            //setTodoList(response.data.res.todo);
                            // setInfo({
                            //     name:response.data.res.name,
                            //     username:response.data.res.username,
                            //     id:response.data.res.id
                                
                            // })
                            //navigate(`/dashboard`)
                        } catch (error) {
                            console.error("Error during signup", error)
                        } finally {
                            setLoading(false)
                        }
                        }
                    }} className={`bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[16px] mt-4 px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                        loading || codematch ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading || codematch}>
                    {!loading && <p>Send verification code</p>}
                    {loading && <p>Loading..</p>}
                </button>}
                <div>

                </div>
                </div>}
                {codematch &&<div>
                    <label for="first_name" className="block mb-2  font-medium text-gray-900 ">Name</label>
                    <div className="w-full flex justify-center">
                        <input maxLength="50" onChange={(e)=>{
                            setFirstName(e.target.value)
                        }} type="text"  className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 " placeholder="John" required />
                    </div>
                    <label for="first_name" className="block mb-2  font-medium text-gray-900 ">Password</label>
                    <div className="w-full flex justify-center">
                        <input onChange={(e)=>{
                            setPassword(e.target.value)
                        }} type="password"  className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 " placeholder="*********" required />
                    </div>
                    <button onClick={async () => {
                                if(firstName=="" || username=="" ||password==""){
                                    alert("fill all the credentials")
                                    
                                }
                                else{
                                    setLoading(true)
                                try {
                                    const response = await axios.post("https://extensionbackend.hamdidcarel.workers.dev/signup", {
                                        name: firstName,
                                        username,
                                        password
                                    })
                                    console.log(response.data)
                                    if(response.data.message && response.data.message=="username already exists"){
                                        setVerified(false)
                                        setCodematch(false)
                                        alert("alreay used email")
                                        
                                    }else{
                                        //localStorage.setItem("token69", response.data.token)
                                        const authToken = response.data.token; 
                                        chrome.storage.local.set({ 'token69': authToken }, () => {
                                            console.log('Token saved in storage.');
                                        });
                                        chrome.runtime.sendMessage({ action: 'setToken', token69: authToken}); 
                                        setLoading(false)
                                        setpage("dash");
                                        //navigate(`/signin`)
                                    }
                                    

                                } catch (error) {
                                    console.error("Error during signup", error)
                                } finally {
                                    setLoading(false)
                                }
                                }
                            }} className={`mt-4 bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[13px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}>
                    {!loading && <p>Sign up</p>}
                    {loading && <p>Loading..</p>}
                </button>
                    
                </div>}
                </div>
                
                
            </div>
        </div>
           </div>
            
        </div>
        </div>

      </div>
            
        </div>
    )
}