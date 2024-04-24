import axios from 'axios';
import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input';
import { server } from '../service/server';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setSignupData } from '../redux/slices/authSlice';


const VerifyOtp = () => {

    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const { signupData } = useSelector(state => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // console.log(signupData);

    useEffect(() => {
        if (otp.length === 6) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [otp]);



    const validateOtp = async () => {
        setOtpLoading(true);

        try {
            const res = await axios.post(`${server}/auth/signup`, { name: signupData.name, email: signupData.email, password: signupData.password, otp }, { withCredentials: true });

            // console.log(res);

            if (res.status === 200) {
                setOtpLoading(false);
                dispatch(setSignupData(null));
                navigate("/signin");
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
                setOtpLoading(false);
            }
        } catch (error) {
            setOtpLoading(false);
            toast.error(error.response.data.message);
            // console.log(error);
        }

    }


    return (
        <div className='relative w-full h-screen'>
            <div className='bg-black text-gray-200 max-w-md top-20 rounded-lg p-8 mx-auto  absolute left-0 right-0'>
                <h2 className='font-bold text-2xl text-center mb-10'>Verify OTP</h2>
                <h2>A verification <b>&nbsp;OTP &nbsp;</b> has been sent to:</h2>
                <span className='italic'>{signupData?.email}</span>

                <div className='my-8'>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        shouldAutoFocus={true}
                        inputStyle={{ fontSize: "22px", width: "38px", height: "38px", borderRadius: "5px", border: "1px solid #ccc", textAlign: "center", margin: "6px 4px", backgroundColor: 'transparent' }}
                        containerStyle={{ padding: '8px 2px', justifyContent: 'center' }}
                        renderInput={(props) => <input {...props} />}
                    />


                    <button className={`w-full  p-2 outline-none rounded-lg cursor-pointer mt-8 ${disabled ? "bg-gray-500 " : "bg-[rgb(190,26,219)]"}`} onClick={validateOtp}>{otpLoading ? "Verifying..." : "Submit"}</button>
                </div>

            </div>
        </div>
    )
}

export default VerifyOtp
