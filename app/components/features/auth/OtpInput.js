import { useEffect, useRef } from "react"
import styles from "./Otpinputs.module.css"
export default function  OtpInputs({otp,setOtp}){
    //برای مدیریت اینپوت ها برای فوکس و بک اسپیس وغیره
    const inputsref=useRef([])

useEffect(()=>{
if(inputsref.current[0]){
    inputsref.current[0].focus()
}
},[])

const handlerBackSpace = (e, index) => {
    if (e.key == "Backspace") {
        const updatedOtp = [...otp];
        
        // اگر خانه فعلی خالی است و خانه قبلی وجود دارد
        if (otp[index] === "" && index > 0) {
            updatedOtp[index - 1] = "";
            setOtp(updatedOtp);
            inputsref.current[index - 1].focus();
        } 
        // اگر خانه فعلی خالی نیست (مقدار دارد)
        else if (otp[index] !== "") {
            updatedOtp[index] = "";
            setOtp(updatedOtp);
            // فوکس در همان خانه می‌ماند (کاربر می‌تواند عدد جدید وارد کند)
        }
        // اگر خانه فعلی خالی است و index == 0 (اولین خانه)
        // هیچ کاری نکن (Backspace در خانه اول نباید کاری انجام دهد)
    }
};


const handelrefindex=(e,index)=>{
    const value=e.target.value
    if(value.length==1){
const updatedeOtp=[...otp]
updatedeOtp[index]=value
setOtp(updatedeOtp )
if(index<4){
inputsref.current[index+1].focus()
}
    }
// console.log(index)



}



    return(
        <>
       <div className={styles.otpInputWrapper}>
<input type="text" className={styles.otpInput}
 inputMode="numeric" maxLength={1}
  ref={(element)=>inputsref.current[0]=element}
  onChange={(e)=>handelrefindex(e,0)}
  onKeyDown={(e)=>handlerBackSpace(e,0)}
  value={otp[0]}
  />
<input type="text" className={styles.otpInput}
 inputMode="numeric" maxLength={1} 
 ref={element=>inputsref.current[1]=element} 
  onChange={(e)=>handelrefindex(e,1)}
  onKeyDown={(e)=>handlerBackSpace(e,1)}
  value={otp[1]}
 />
<input type="text" className={styles.otpInput}
 inputMode="numeric" maxLength={1}
  ref={element=>inputsref.current[2]=element}
   onChange={(e)=>handelrefindex(e,2)}
   onKeyDown={(e)=>handlerBackSpace(e,2)}
   value={otp[2]}
  />
<input type="text" className={styles.otpInput}
 inputMode="numeric" maxLength={1}
  ref={element=>inputsref.current[3]=element}
   onChange={(e)=>handelrefindex(e,3)}
   onKeyDown={(e)=>handlerBackSpace(e,3)}
   value={otp[3]}
  />
<input type="text" className={styles.otpInput}
 inputMode="numeric" maxLength={1}
  ref={element=>inputsref.current[4]=element} 
   onChange={(e)=>handelrefindex(e,4)}
   onKeyDown={(e)=>handlerBackSpace(e,4)}
   value={otp[4]}
  />



       </div>
        </>
    )
}