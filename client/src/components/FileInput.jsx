import React, { useState } from 'react'
import storage from '../firebase';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { MdCloudUpload } from 'react-icons/md';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { LinearProgress } from "@mui/material";



const FileInput = ({
    label,
    name,
    value,
    handleInputState,
    type,
    ...rest
}) => {
    const [progress, setProgress] = useState(0);
    const [progressShow, setProgressShow] = useState(false);


    const handleUpload = () => {
        setProgressShow(true);
        const fileName = new Date().getTime() + value?.name;
        const storageRef = ref(
            storage,
            type === "file" ? `/file/${fileName}` : `/images/${fileName} `
        );
        const uploadTask = uploadBytesResumable(storageRef, value);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const uploaded = Math.floor(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(uploaded);
            },
            (error) => {
                console.log(error);
                toast.error("An error occured while uploading!");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    handleInputState(name, url);
                    setProgressShow(false);
                    if (type === "audio") {
                        const audio = new Audio(url);
                        audio.addEventListener(
                            "loadedmetadata",
                            () => {
                                const duration = Math.floor(audio.duration);
                                handleInputState("duration", duration);
                            },
                            false
                        );
                    }
                });
            }
        );
    };


    return (
        <div className='border z-10 h-[8rem] rounded-2xl gap-2 border-dashed flex flex-col justify-center items-center bg-[rgb(28,30,39)] relative'>

            {!value && <MdCloudUpload size={40} />}
            {!value && <input type="file" name="thumbnail" id={name} className='hidden'
                {...rest}
                onChange={(e) => handleInputState(name, e.currentTarget.files[0])}
            />}
            {!value && <label htmlFor={name} className='text-[rgb(190,26,219)] text-xl font-semibold cursor-pointer'>{label}</label>}


            {type === "image" && value && (
                <img
                    className="object-fill overflow-hidden w-full opacity-50 rounded-2xl"
                    src={typeof value === "string" ? value : URL.createObjectURL(value)}
                    alt="file"
                />
            )}


            <div className="absolute w-full flex flex-col gap-2 justify-center items-center cursor-pointer">
                {value !== null && !progressShow && typeof value !== "string" && <FaCloudUploadAlt onClick={handleUpload} size={40} />}

                {progressShow && <LinearProgress
                    sx={{ borderRadius: "10px", height: 6, width: "70%" }}
                    variant="determinate"
                    value={progress}
                    color={"success"}
                />
                }

                {progress > 99 && !progressShow && value && "100% Uploaded"}
            </div>


        </div>
    )
}

export default FileInput
