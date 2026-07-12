"use client"
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";


const AuthContext=createContext()

export function AuthProvider({children}){
const[user,setUser]=useState(null)
const[loading,setLoading]=useState(false)
const router=useRouter()


useEffect(()=>{
const fetchUser=async()=>{
try{
setLoading(true)
const response=await fetch("/api/auth/getme",{credentials:"include"})
const data=await response.json()

if(data.success && data.user)setUser(data.user)
else setUser(null)



}catch(error){
console.log("error fetchingUSer ",error)
setUser(null)
}finally{
setLoading(false)
}
}
fetchUser()
},[])







const logout=async ( )=>{
try{
const response=await fetch("/api/auth/logout",{
    method:"POST",
    credentials:"include"
})
const data=await response.json()

if(data.success){
    setUser(null)
    toast.success("با موفقیت خارج شدی")
    router.push("/auth")
} else{
    toast.error("خطا در خارج شدن از حساب کاربری")
}


}catch(error){
console.log("khata dar server",error)
toast.error("خطایی رخ داد")
}
}



const userRefresh=async()=>{
try{
setLoading(true)
const response=await fetch("/api/auth/getme",{credentials:"include"})
const data=await response.json()

if(data.success && data.user)setUser(data.user)
else setUser(null)



}catch(error){
console.log("error fetchingUSer ",error)
setUser(null)
}
}


const valuecontext={
user,
setUser,
logout,
loading,
userRefresh

}

return(
<AuthContext.Provider value={valuecontext}>
{children}

</AuthContext.Provider>

)
    
  




}

export function useAuth(){
    const context=useContext(AuthContext)
if(!context){
    toast.error("context is not found")
}

    return context
}