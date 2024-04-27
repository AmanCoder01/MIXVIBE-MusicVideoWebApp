import React from 'react'
import AppLayout from '../components/AppLayout'
import { FaSearch } from "react-icons/fa";
import { Category, SongCategory } from '../utils/Data';
import { Link } from 'react-router-dom';
import DefaultCard from '../components/DefaultCard';


const Search = () => {
    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)]  overflow-auto '>
                <div className='py-6 md:py-8 px-7 md:px-12 my-6'>
                    <div className='max-w-3xl w-full relative flex justify-center mx-auto'>
                        <input type="text" placeholder='Search Song / Videos'
                            className='w-full  bg-inherit rounded-3xl pr-4 pl-12 border p-3'
                        />
                        <div className='absolute top-4 left-[1rem]'>
                            <FaSearch />
                        </div>
                    </div>




                    <div className='my-8 mb-11'>

                        <h1 className='text-xl   font-semibold'>Browse All</h1>

                        <div className='flex flex-wrap gap-6 mt-6 mx-auto  items-center'>
                            {SongCategory.map((category, index) => (
                                <Link to={`/showsongs/${category.name.toLowerCase()}`} key={index} style={{ textDecoration: "none" }}>
                                    <DefaultCard category={category} />
                                </Link>
                            ))}
                            {Category.map((category, index) => (
                                <Link to={`/showvideos/${category.name.toLowerCase()}`} key={index} style={{ textDecoration: "none" }}>
                                    <DefaultCard category={category} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}

export default Search
