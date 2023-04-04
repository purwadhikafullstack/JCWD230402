import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaHome } from 'react-icons/fa'
import { MdCloudUpload, MdDelete, MdPhoneIphone } from 'react-icons/md'
import Loader from '../components/Loader';
import axios from 'axios';
import { API_URL } from '../helper';
import { NavLink } from 'react-router-dom';

function EditProfile() {
    //-----------Info----------//
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState(null);

    //----------LOCATION------//
    const [province, setProvince] = useState([])
    const [provinceName, setProvinceName] = useState("")
    const [provinceId, setProvinceId] = useState("")
    const [city, setCity] = useState([])
    const [cityName, setCityName] = useState("")
    const [postalCode, setPostalCode] = useState()
    const [city_id, setCity_id] = useState("")
    const [uuid, setuuid] = useState("")

    let token = localStorage.getItem("Gadgetwarehouse_userlogin");


    const getProvince = async () => {
        try {
            let res = await axios.get(`${API_URL}/rajaongkir/province`)
            setProvince(res.data.rajaongkir.results)
        } catch (error) {
            console.log("error province", error)
        }
    }

    const getCity = async () => {
        try {
            let res = await axios.get(`${API_URL}/rajaongkir/city/${provinceId}`)
            // console.log(`ini res getCity`, res.data.rajaongkir.results);

            setCity(res.data.rajaongkir.results)

        } catch (error) {
            console.log("error getCity", error);
        }
    }


    useEffect(() => {
        getProvince();
        getCity();
    }, [provinceId, provinceName])

    const clickProvince = (nameprovince) => {
        setProvinceName(nameprovince)
    }

    const printProvince = () => {
        return province.map((val, idx) => {
            return (
                <option
                    onClick={() => clickProvince(val.province)}
                    value={`${val.province_id}`}
                >
                    {val.province}</option>
            )
        })
    }

    const clickCity = (namecity, kodepos) => {
        setCityName(namecity);
        setPostalCode(kodepos);
        console.log('postalCode', postalCode)
    }

    const printCity = () => {
        return city.map((val, idx) => {

            return (
                <option onClick={() => clickCity(val.city_name, val.postal_code)}
                    value={`${val.city_id}`}
                >
                    {val.city_name}</option>
            )
        })
    }

    const saveDetails = async () => {
        try {
            let token = localStorage.getItem("Gadgetwarehouse_userlogin")
            let res = await axios.patch(`${API_URL}/profile/edit`, {
                name: name,
                gender: gender,
                phone: phone,
                address: address,
                city: cityName,
                postalCode: postalCode,
                provinceId: provinceId,
                city_id: city_id
            }, {
                headers: { Authorization: `Bearer${token}`, }
            });
            console.log("response from from save profile:", res);
        } catch (error) {
            console.log("error", error);

        }
    }


    return (
        <div className="w-full mt-28 mb-10 min-h-screen flex items-center justify-center">
            <div className="w-[90%] md:w-[50%]  bg-bgglass backdrop-blur rounded-lg p-4 flex flex-col items-center justify-center gap-4">

                {/* user name */}
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

                {/* upload form

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
                    <Loader />
                </div> */}

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
                {/* -----------------------address----------------- */}
                <div className='flex flex-col md:flex-row gap-2'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-[#1BFD9C]'>Province</label>
                        <select onChange={(e) => { setProvinceId(e.target.value); }} placeholder="-- Select --" className='w-[80%]'>
                            {printProvince()}
                        </select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-[#1BFD9C]'>City</label>
                        <select onChange={(e) => { setCity_id(e.target.value); }} placeholder="-- Select --" className='w-[80%]'>
                            {printCity()}
                        </select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-[#1BFD9C]'>Postal Code</label>
                        <input isDisabled={true} placeholder={postalCode} _placeholder={{ color: "black" }} defaultValue={postalCode} className='w-[80%]'>
                        </input>
                    </div>
                </div>



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

                    {/* <select
                        className="outline-none w-full text-base border-b-2 border-emerald-300 p-2 rounded-md cursor-pointer"
                        onChange={(e) => {
                            setProvinceId(e.target.value);
                            // setProvinceName(e.target.value.split(",")[1]);
                        }}
                            placeholder={"-- Select --"}>
                            {printProvince()}
                    </select> */}

                </div>

                <div className="flex justify-between w-full">
                    <button
                        type="button"
                        className="w-1/4 md:w-auto border-none outline-none bg-emerald-400 px-2 md:px-12 py-2 rounded-lg text-lg text-white font-semibold hover:bg-emerald-300 hover:text-black hover:scale-105 duration-500"
                        onClick={saveDetails}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="w-1/4 md:w-auto border-none outline-none bg-emerald-400 px-2 md:px-12 py-2 rounded-lg text-lg text-white font-semibold hover:bg-emerald-300 hover:text-black hover:scale-105 duration-500"

                    ><NavLink to='/Customerprofile'>
                            Cancel
                        </NavLink>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile