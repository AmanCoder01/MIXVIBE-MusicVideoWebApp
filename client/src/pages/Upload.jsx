import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { Category, SongCategory } from '../utils/Data';
import FileInput from '../components/FileInput';
import { server } from '../service/server';
import toast from 'react-hot-toast';
import axios from 'axios';


const Upload = () => {
    const [disabled, setDisabled] = useState(true);
    const [content, setContent] = useState({
        name: "",
        artist: "",
        img: "",
        category: "Select Category",
        type: "audio",
        file: ""
    });


    const handleInputState = (name, value) => {
        setContent((prev) => ({ ...prev, [name]: value }));
    };



    useEffect(() => {
        if (content === null) {
            setDisabled(true);
            setContent({
                name: "",
                artist: "",
                img: "",
                file: "",
            });
        } else {
            if (content.name === "" || content.artist === "" || content.img === "" || content.file === "") {
                setDisabled(true);
            } else {
                setDisabled(false);
            }
        }
    }, [content]);



    const handleSave = async (e) => {
        e.preventDefault();



        try {
            const res = await axios.post(`${server}/content/create`, content, {
                withCredentials: true,
            });

            // console.log(res);

            if (res.status === 200) {
                toast.success(res.data.message);
                setContent({
                    name: "",
                    artist: "",
                    img: "",
                    category: "Select Category",
                    type: "audio",
                    file: ""
                });
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            toast.error(error?.response?.data?.message);
            console.log(error);
        }
    };




    return (
        <AppLayout>
            <div className='w-full h-full bg-[rgb(28,30,39)] overflow-auto'>
                <div className='py-10 mb-10'>
                    <div className='max-w-xl  bg-black mx-auto p-8 rounded-lg'>
                        <h1 className='text-center text-xl font-bold'>Upload Content</h1>
                        <p className='py-4'>Content Details:</p>

                        <form className='flex flex-col justify-center gap-3' onSubmit={handleSave}>
                            <FileInput
                                label="Choose image..."
                                type="image"
                                name="img"
                                value={content.img}
                                handleInputState={handleInputState}
                            />

                            <FileInput
                                label="Choose Audio / Video..."
                                type="file"
                                name="file"
                                value={content.file}
                                handleInputState={handleInputState}
                            />


                            <div>
                                <input type="text" name='name' placeholder='Song / Video Name' className='p-3 w-full rounded-lg outline-none px-4 bg-[rgb(28,30,39)]' value={content?.name}
                                    onChange={(e) => handleInputState("name", e.target.value)} />
                            </div>

                            <div>
                                <input type="text" placeholder='Artist Name' className='p-3 w-full rounded-lg px-4 outline-none bg-[rgb(28,30,39)]' name="artist"
                                    value={content?.artist}
                                    onChange={(e) => handleInputState("artist", e.target.value)} />
                            </div>



                            <div className='flex justify-between items-center gap-4'>
                                <select className='w-1/3 p-3 bg-[rgb(28,30,39)] outline-none rounded-lg'
                                    name='type'
                                    value={content?.type}
                                    onChange={
                                        (e) => handleInputState("type", e.target.value)
                                    }>
                                    <option value="audio">Audio</option>
                                    <option value="video">Video</option>
                                </select>


                                <select className='w-2/3 p-3 bg-[rgb(28,30,39)] outline-none rounded-lg'
                                    name='category'
                                    value={content?.category}
                                    onChange={
                                        (e) => handleInputState("category", e.target.value)
                                    }>
                                    <option disabled hidden>Select Category</option>
                                    {content?.type === "video" && Category.map((category, index) => (
                                        <option key={index} value={category.name}>{category.name}</option>
                                    ))}
                                    {content?.type === "audio" && SongCategory.map((category, index) => (
                                        <option key={index} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>


                            <button type='submit' className={`w-full text-xl  p-2 outline-none rounded-lg cursor-pointer  mt-3 ${disabled ? "bg-gray-500" : "bg-[rgb(190,26,219)]"}`}>Create</button>

                        </form>

                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Upload
