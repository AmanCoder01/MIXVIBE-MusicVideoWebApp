import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import axios from 'axios'
import { server } from '../service/server'
import { useParams } from 'react-router-dom'
import DashCard from '../components/DashCard'
import { openPlayer } from '../redux/slices/audioPlayerSlice'
import { useDispatch } from 'react-redux'

const ShowSongCategory = () => {

    const { category } = useParams();
    const [categoryData, setCategoryData] = useState([]);
    const dispatch = useDispatch();


    const fetchCategory = async () => {
        try {
            const res = await axios.get(`${server}/content/category/${category}`, { withCredentials: true });

            console.log(res);
            setCategoryData(res.data);

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchCategory()
    }, [])




    const addviewtToPodcast = async (id) => {
        try {
            const res = await axios.post(`${server}/content/addview/${id}`, { withCredentials: true });

            // console.log(res);

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
                    episode: categoryData
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
                <div className='py-6 md:py-9 px-7 md:px-12 my-6 mb-14'>
                    <h1 className='text-xl font-semibold'>{category.substring(0, 1).toUpperCase() + category.substring(1, category.length)}</h1>

                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3  md:gap-5 mt-6'>
                        {
                            categoryData?.map((data, index) => {
                                return <DashCard index={index} key={index} data={data} handleOpenPlayer={handleOpenPlayer} />
                            })
                        }
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default ShowSongCategory
