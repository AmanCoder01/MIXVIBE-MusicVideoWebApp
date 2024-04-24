import React, { useEffect, useState } from 'react'
import OAuth from '../components/OAuth'
import { Link, useNavigate } from 'react-router-dom'
import validator from "validator";
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../service/server';
import { useDispatch, useSelector } from 'react-redux';
import { setSignupData } from '../redux/slices/authSlice';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

const Signup = () => {
    const [nameValidated, setNameValidated] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [credentialError, setcredentialError] = useState("");
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [nameCorrect, setNameCorrect] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);


    //validate email
    const validateEmail = () => {
        if (validator.isEmail(email)) {
            setEmailError("");
        } else {
            setEmailError("Enter a valid Email Id!");
        }
    };

    //validate password
    const validatePassword = () => {
        if (password.length < 8) {
            setcredentialError("Password must be atleast 8 characters long!");
            setPasswordCorrect(false);
        } else if (password.length > 16) {
            setcredentialError("Password must be less than 16 characters long!");
            setPasswordCorrect(false);
        } else if (
            !password.match(/[a-z]/g) ||
            !password.match(/[A-Z]/g) ||
            !password.match(/[0-9]/g) ||
            !password.match(/[^a-zA-Z\d]/g)
        ) {
            setPasswordCorrect(false);
            setcredentialError(
                "Password must contain atleast one lowercase, uppercase, number and special character!"
            );
        } else {
            setcredentialError("");
            setPasswordCorrect(true);
        }
    };

    //validate name
    const validateName = () => {
        if (name.length < 4) {
            setNameValidated(false);
            setNameCorrect(false);
            setcredentialError("Name must be atleast 4 characters long!");
        } else {
            setNameCorrect(true);
            if (!nameValidated) {
                setcredentialError("");
                setNameValidated(true);
            }
        }
    };


    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [])


    useEffect(() => {
        if (email !== "") validateEmail();
        if (password !== "") validatePassword();
        if (name !== "") validateName();

        if (validator.isEmail(email) && passwordCorrect && nameCorrect) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [name, email, passwordCorrect, password, nameCorrect]);




    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await axios.post(`${server}/auth/sendotp`, { email, name, password }, { withCredentials: true });

            // console.log(res);

            if (res.status === 200) {
                toast.success(res.data.message);
                dispatch(setSignupData({ name, password, email }));
                setLoading(false);
                navigate("/verify");
            } else {
                setLoading(false);
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
            // console.log(error);
        }
    };


    return (
        <div className='relative w-full h-screen'>
            <div className='bg-black text-gray-200 max-w-md top-20 rounded-lg p-8 mx-auto  absolute left-0 right-0'>
                <h2 className='font-bold text-2xl text-center mb-8'>Sign Up</h2>

                <OAuth />
                <form onSubmit={handleSignUp}>

                    <div className='text-center'>
                        --------------  or  ---------------
                    </div>


                    <div className='my-6 flex flex-col justify-center gap-4'>
                        <div className='relative'>
                            <input type="text" id="name" name="name" placeholder="Full Name" className='w-full p-2 pl-12 bg-inherit border rounded-lg outline-none' onChange={(e) => setName(e.target.value)} />

                            <div className='absolute top-3 left-3'>
                                <FaUser size={15} />
                            </div>
                        </div>

                        <div className='relative'>
                            <input type="email" id="email" name="email" placeholder="Email Id" className='w-full p-2 pl-12 bg-inherit border rounded-lg outline-none' onChange={(e) => setEmail(e.target.value)} />
                            {emailError && <p className='text-red-500 text-sm'>{emailError}</p>}

                            <div className='absolute top-3 left-3'>
                                <MdEmail size={19} />
                            </div>
                        </div>

                        <div className='relative'>
                            <input type={seePassword ? "text" : "password"} id="password" name="password" placeholder="Password" className='w-full px-12 p-2 bg-inherit border rounded-lg outline-none' onChange={(e) => setPassword(e.target.value)} />
                            <div className='absolute top-3 left-3'>
                                <RiLockPasswordFill size={19} />
                            </div>

                            <span
                                className="absolute right-3  top-3 cursor-pointer "
                                onClick={() => setSeePassword(!seePassword)}
                            >
                                {seePassword ? <IoMdEyeOff size={20} /> : <IoEye size={20} />}
                            </span>
                        </div>


                        {credentialError && <p className='text-red-500 text-sm'>{credentialError}</p>}

                        <button disabled={credentialError === "" ? false : true} className={`w-full  p-2 outline-none rounded-lg cursor-pointer  mt-3 ${disabled ? "bg-gray-500" : "bg-[rgb(190,26,219)]"}`}>{loading ? "Sending Otp..." : "Create Account"}</button>
                    </div>

                    <div>
                        Already have an account ? <Link to="/signin" className='text-blue-400'>Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
