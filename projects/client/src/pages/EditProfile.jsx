import React, { useState } from 'react';
import { FaUserAlt, FaHome } from 'react-icons/fa'
import { MdCloudUpload, MdDelete, MdPhoneIphone } from 'react-icons/md'
import Loader from '../components/Loader';
import axios from 'axios';
import { API_URL } from '../helper';

function EditProfile() {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState(null);
    const [imageAsset, setImageAsset] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const uploadImage = (e) => { }
    const deleteImage = (e) => { }
    const saveDetails = async () => {
        try {
            let res = await axios.post(`${API_URL}/profile/edit`, {
                name,
                gender,
                phone,
                address
            })
        } catch (error) {
            console.log("error", error);

        }
    }

    return (
        <div className="w-full mt-16 min-h-screen flex items-center justify-center">
            <div className="w-[90%] md:w-[50%] border border-emerald-300 bg-bgglass backdrop-blur rounded-lg p-4 flex flex-col items-center justify-center gap-4">

                {/* product name */}
                <div className="w-full py-2 border-b border-emerald-300 flex items-center gap-2">
                    <FaUserAlt className="text-xl text-[#1BFD9C]" />
                    <input
                        type="text"
                        required
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-[#1BFD9C] text-[#1BFD9C]" />
                </div>

                {/* gender form */}
                <div className="w-full">
                    <select
                        onChange={(e) => setGender(e.target.value)}
                        className="outline-none w-full text-base border-b-2 border-emerald-300 p-2 rounded-md cursor-pointer"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                {/* upload form */}

                <div className="group flex justify-center items-center flex-col border-2 border-dotted border-emerald-300 w-full h-[225px] md:h-[250px] cursor-pointer rounded-lg">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            {!imageAsset ? (
                                <>
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                            <MdCloudUpload className="text-gray-500 text-3xl hover:text-[#1BFD9C]" />
                                            <p className="text-gray-500 hover:text-[#1BFD9C]">
                                                Click here to upload
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            name="uploadimage"
                                            accept="image/*"
                                            onChange={uploadImage}
                                            className="w-0 h-0"
                                        />
                                    </label>
                                </>
                            ) : (
                                <>
                                    <div className="relative h-full">
                                        <img
                                            src={imageAsset}
                                            alt="uploaded image"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                                            onClick={deleteImage}
                                        >
                                            <MdDelete className="text-white" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Phone Number */}
                <div className="w-full flex flex-col md:flex-row items-center gap-3">
                    <div className="w-full py-2 border-b border-emerald-300 flex items-center gap-2">
                        <MdPhoneIphone className="text-[#1BFD9C] text-2xl" />
                        <input
                            type="text"
                            required
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone Number"
                            className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-[#1BFD9C] text-[#1BFD9C]"
                        />
                    </div>


                </div>
                {/* Address */}
                <div className="w-full py-2 border-b border-emerald-300 flex items-center gap-2">
                    <FaHome className="text-[#1BFD9C] text-2xl" />
                    <textarea
                        type="text"
                        required
                        maxlength="400"
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Your Address"
                        className=" overflow-y-hidden w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-[#1BFD9C] text-[#1BFD9C]"
                    />
                </div>

                <div className="flex items-center w-full">
                    <button
                        type="button"
                        className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-400 px-12 py-2 rounded-lg text-lg text-white font-semibold hover:bg-emerald-300"
                        onClick={saveDetails}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile