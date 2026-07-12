import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
export function IsAdmin(req){
const accessToken=req.cookies.get("accessToken")?.value
if(!accessToken){
    return NextResponse.json(
        {success:false,message:"لطفا اول لاگین شوید"},
         {    status:401 }
       
    )
}

let payload;
try{
    payload=jwt.verify(accessToken,process.env.ACCEST_TOKEN_SECRET)
    if(payload.role!=="admin"){
        return NextResponse.json(
        {success:false,message:"شما دسترسی لازم را ندارید "},
        {status:403}
    ) 
    }
    
return {
  isAdmin: true,
  userId: payload.userId,
};
}
catch(error){
return NextResponse.json(
    {success:false,message:"توکن نامعتبر یا منقضی شده است "},
    {status:401}
)
}


}



export function getcurrentUSer(req){
const accessToken=req.cookies.get("accessToken")?.value

if(!accessToken){
    return Response.json(
        {success:false,message:"لطفا اول لاگین کن "},
        {status:401}
    )
}
let payload;
try{
payload=jwt.verify(accessToken,process.env.ACCEST_TOKEN_SECRET)
return {success:true,userId:payload.userId}
}

catch(error){
   return Response.json(
    {success:false,message:"توکن نامعتبر است "},{status:401}
   ) 
}


}
