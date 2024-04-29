import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { FaSearch } from "react-icons/fa";
import { Category, SongCategory } from '../utils/Data';
import { Link } from 'react-router-dom';
import DefaultCard from '../components/DefaultCard';
import axios from 'axios';
import { server } from '../service/server';
import DashCard from '../components/DashCard';
import { useDispatch, useSelector } from 'react-redux';
import { openPlayer } from '../redux/slices/audioPlayerSlice';


const Search = () => {
    const [userData, setUserData] = useState();

    const [searched, setSearched] = useState("");
    const [searchedData, setSearchedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);


    const dispatch = useDispatch()

    const fetchSearchData = async () => {
        if (searched.length < 0 && searched === "") return;
        setLoading(true);

        try {
            const res = await axios.get(`${server}/content/search?q=${searched}`, { withCredentials: true });

            if (res.status === 200) {
                setSearchedData(res.data);
                setLoading(false)

            }

        } catch (err) {
            console.log(err);
            setLoading(false)

        }
    }

    const getUser = async () => {
        try {
            const res = await axios.get(`${server}/profile/${user?._id}`, { withCredentials: true });
            if (res.status == 200) {
                setUserData(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {

        getUser();
    }, [])



    useEffect(() => {

        const timerId = setTimeout(fetchSearchData, 1000);


        // Cleanup when the component unmounts
        return () => clearTimeout(timerId);

    }, [searched])



    const addviewtToPodcast = async (id) => {
        try {
            const res = await axios.post(`${server}/content/addview/${id}`, { withCredentials: true });

        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenPlayer = async (id, type, index) => {
        await addviewtToPodcast(id);

        if (type === "audio") {
            //open audio player
            dispatch(
                openPlayer({
                    openPlayer: true,
                    type: "audio",
                    index: index,
                    currenttime: 0,
                    episode: searchedData
                })
            )
        } else {
            //open video player
            dispatch(
                dispatch(
                    openPlayer({
                        type: "video",
                        podid: podid,
                        index: index,
                        currenttime: 0
                    })
                )
            )
        }

    }


    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='py-6 md:py-8 px-7 md:px-12 my-6'>
                    <div className='max-w-3xl w-full relative flex justify-center mx-auto'>
                        <input type="text" placeholder='Search Song / Videos'
                            className='w-full  bg-inherit rounded-3xl pr-4 pl-12 border p-3 outline-none'
                            value={searched}
                            onChange={(e) => setSearched(e.target.value)}
                        />
                        <div className='absolute top-4 left-[1rem]'>
                            <FaSearch />
                        </div>
                    </div>




                    <div className='my-8 mb-11'>

                        {
                            searched === "" ?

                                <div>
                                    <h1 className='text-xl   font-semibold'>Browse All</h1>

                                    <div className='flex flex-wrap gap-6 mt-6 mx-auto  items-center overflow-hidden'>
                                        {SongCategory.map((category, index) => (
                                            <Link to={`/ showsongs / ${category.name.toLowerCase()}`} key={index} style={{ textDecoration: "none" }}>
                                                <DefaultCard category={category} />
                                            </Link>
                                        ))}
                                        {Category.map((category, index) => (
                                            <Link to={`/ showvideos / ${category.name.toLowerCase()}`} key={index} style={{ textDecoration: "none" }}>
                                                <DefaultCard category={category} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                :

                                loading ?
                                    <p className="loader    mx-auto w-full flex justify-center items-center my-12"></p>

                                    :
                                    searchedData.length === 0 ?

                                        <h1>No Songs/Video Found !</h1>

                                        :

                                        <div className=' grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
                                            {
                                                searchedData?.map((data, index) => {
                                                    return <DashCard index={index} key={index} userData={userData} data={data} handleOpenPlayer={handleOpenPlayer} />
                                                })
                                            }
                                        </div>

                        }
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}

export default Search
