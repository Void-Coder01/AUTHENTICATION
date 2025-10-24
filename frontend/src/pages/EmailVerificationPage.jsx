import { motion, useScroll } from 'framer-motion'
import { useState,useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import  toast  from 'react-hot-toast'

const EmailVerificationPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    const { verifyEmail, isLoading, error } = useAuthStore();

    useEffect(() => {
        if(code.every((index) =>index !== "")){
            console.log("code submitted ", code)
            handleOnSumbit(new Event("submit"));
        }
    },[code])

    const handleOnSumbit = async (e) => {
        e.preventDefault();

        try {
            await verifyEmail(code.join(""));
            navigate("/");
            toast("Email verified successfully");
            
        } catch (error) {
            toast(error)
            console.log(error);
        }
    }

    const handleOnChange = (index, value) => {
        
        const newCode = [...code];
        //if copy pasted case 
        if(value.length > 1){
            const pastedCode = value.slice(0,6).split("");
            for(let i =0 ; i<pastedCode.length;i++){
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);

            //cursor ko automatically next unfilled input p lekr janeka logic 
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5 ;
            inputRefs.current[focusIndex].focus();
        }else{
            newCode[index] = value;

            setCode(newCode);

            // Move focus to the next input field if value is entered
            if(value && index < 5){
                inputRefs.current[index+1].focus();
            }
        }
    };

    const handleOnKeydown = (index, e) => {
        //if index > 0 and code k uss index pr value nai h cuz delete hogyi hogi jab backspace daba tab and key = backspace
        if(e.key === "Backspace" && index > 0 && !code[index]){
            inputRefs.current[index-1].focus();
        }
    }

    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            
            <motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
			>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Verify Your Email
				</h2>
				<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>

                <form onSubmit={handleOnSumbit} className='space-y-6'>
                    <div className='flex justify-between'>
                        {code.map((digit, index) => (
                            <input 
                                key={index}
                                value={digit}
                                ref={(el) => inputRefs.current[index] = el}
                                type="text"
                                onChange={(e) => handleOnChange(index, e.target.value)}
                                onKeyDown = {(e) => handleOnKeydown(index, e)}
                                maxLength='6'
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
                            />
                        ))}
                    </div> 
                    {error && <p className='text-sm text-red-500 m-auto font-semibold mt-2'>{error}</p>}
                    <motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)}
						className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
					>
						{isLoading ? "Verifying..." : "Verify Email"}
					</motion.button>
                </form>

            </motion.div>
        </div>
    )
}

export default EmailVerificationPage;