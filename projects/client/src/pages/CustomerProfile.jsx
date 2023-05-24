import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { FaUserAlt, FaHome, } from 'react-icons/fa'
import { MdPhoneIphone } from 'react-icons/md'
import { BsCamera } from 'react-icons/bs'
import axios from 'axios';
import { API_URL } from '../helper';
import { useToast } from '@chakra-ui/react';


function CustomerProfile(props) {

  const toast = useToast();
  const nameUser = useSelector((state) => state.authReducer.name);
  const genderUser = useSelector((state) => state.authReducer.gender);
  const phoneUser = useSelector((state) => state.authReducer.phone);
  const id = useSelector((state) => state.authReducer.id);

  // ----------------------profileInfo---------------------------//
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(" ");

  let token = localStorage.getItem("Gadgetwarehouse_userlogin");

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const hideMenu = () => {
    setShowMenu(false)
  }
  //-------------------GET USER PROFILE--------------------//
  const [userInfo, setUserInfo] = useState([]);
  const getUserInfo = async () => {
    try {
      let res = await axios.get(`${API_URL}/profile/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      setUserInfo(res.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  //------------------EDIT INFO PROFILE (SAVE & CANCEL)-------------//

  const saveProfile = async () => {
    try {
      let token = localStorage.getItem("Gadgetwarehouse_userlogin");
      let response = await axios.patch(`${API_URL}/profile/edit`,
        {
          name: name,
          phone: phone,
          gender: gender,
        }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      if (response.data.success) {
        toast({
          title: `${response.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setName('');
        setPhone('');
        setGender('');
        setShowMenu(false);
      };
    } catch (error) {
      console.log("ini error dari onBtnEditProfile : ", error);
      toast({
        title: `${error.response.data.error[0].msg}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const btnCancelEdit = () => {
    setName("")
    setPhone("")
    setGender("")
    setShowMenu(false)
  }

  //--------------Location------------//
  const [province, setProvince] = useState([])
  const [provinceName, setProvinceName] = useState("")
  const [province_id, setProvince_id] = useState("")
  const [city, setCity] = useState([])
  const [cityName, setCityName] = useState("")
  const [postalCode, setPostalCode] = useState()
  const [city_id, setCity_id] = useState("")
  const [uuid, setuuid] = useState("")
  const [address, setAddress] = useState("");

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
      let res = await axios.get(`${API_URL}/rajaongkir/city/${province_id}`)
      setCity(res.data.rajaongkir.results)
    } catch (error) {
      console.log("error getCity", error);
    }
  }


  useEffect(() => {
    getProvince();
    getCity();
    getAllLocation();
  }, [province_id, provinceName])

  const clickProvince = (provinceName) => {
    setProvinceName(provinceName)
  }

  const printProvince = () => {
    return province.map((val, idx) => {
      return (
        <option
          onClick={() => clickProvince(val.province)}
          value={val.province_id}
        >
          {val.province}</option>
      )
    })
  }

  const clickCity = (cityName, postalCode) => {
    setCityName(cityName);
    setPostalCode(postalCode);
  }

  const printCity = () => {
    return city.map((val, idx) => {
      return (
        <option onClick={() => clickCity(val.city_name, val.postal_Code)}
          value={val.city_id}
        >
          {val.city_name}</option>
      )
    })
  }

  //-------add and edit Location pop up--------//
  const [showMenuLocation, setShowMenuLocation] = useState(false);
  const toggleMenuLocation = () => {
    setShowMenuLocation(!showMenuLocation)
  }

  const hideMenuLocation = () => {
    setShowMenuLocation(false)
    setTimeout(() => {
      window.location.reload();
    }, 50);
    setAddress("")
    setProvince("")
    setCity("")
    setPostalCode("")
  }

  //-------editLocation pop up--------//
  const [showMenuLocationEdit, setShowMenuLocationEdit] = useState(false);
  const toggleMenuLocationEdit = () => {
    setShowMenuLocationEdit(!showMenuLocationEdit)
  }

  const hideMenuLocationEdit = () => {
    setShowMenuLocationEdit(false)
    setTimeout(() => {
      window.location.reload();
    }, 10);
    setAddress("")
    setProvince("")
    setCity("")
    setPostalCode("")
  }

  //-------------------Add User Location------------------//
  const btnaddLocation = async () => {
    try {
      alert(cityName)
      alert(provinceName)
      let res = await axios.post(`${API_URL}/profile/address`, {
        address: address,
        province: provinceName,
        city: cityName,
        postalCode: postalCode,
        province_id: province_id,
        city_id: city_id
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (res.data.success) {
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setPostalCode()
        getAllLocation()
      }

    } catch (error) {
      console.log("ini error add Location:", error);
      if (error.response.data.error) {
        toast({
          title: `${error.response.data.error[0].msg}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }


  //---------------------Get user Location-----------------//
  const [addressList, setAddressList] = React.useState([])
  const primaryIndex = parseInt(localStorage.getItem("primaryIndex"));

  const getAllLocation = async () => {
    try {
      let res = await axios.get(`${API_URL}/profile/address/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      console.log(`getAllLocation`, res);
      setAddressList(res.data)

    } catch (error) {
      console.log(error);
    }
  }

  const printAddress = () => {
    return addressList.map((val, idx) => {
      return (<tr className='text-white gap-3 w-full'>
        <div className='flex justify-between gap-6 py-3'>
          <div className='flex justify-between gap-5'>
            <td>{idx + 1}</td >
            <td>{val.address}</td >
            <td>{val.province}</td>
            <td>{val.city}</td>
            <td>{val.postalCode}</td>
          </div>
          <td>
            <div className='flex gap-3'>
              <button className='bg-emerald-400 px-1 rounded-md hover:bg-emerald-300 hover:text-black hover:scale-105 duration-300' onClick={toggleMenuLocationEdit} type='button'>Edit</button>
              <button className='bg-emerald-400 px-1 rounded-md hover:bg-emerald-300 hover:text-black hover:scale-105 duration-300' onClick={onBtnDelete} type='button'>Delete</button>
              {!val.isPrimary && (
                <button className='bg-emerald-400 px-1 rounded-md hover:bg-emerald-300 hover:text-black hover:scale-105 duration-300'>
                  Set as Primary
                </button>
              )}
              {val.isPrimary && <span>Primary Address</span>}
            </div></td>
        </div>
      </tr>
      )
    })
  }

  const printPrimaryAddress = () => {
    const primaryAddress = addressList.find((address) => address.isPrimary);
    if (!primaryAddress) {
      return <p>No primary address found</p>;
    }
    return (
      <div>
        <h3>Primary Address</h3>
        <p>{primaryAddress.address}</p>
        <p>{primaryAddress.province}</p>
        <p>{primaryAddress.city}</p>
        <p>{primaryAddress.postalCode}</p>
      </div>
    );
  };

  //--------------------Edit Address----------------//

  const btneditAddress = async () => {
    try {
      let token = localStorage.getItem("Gadgetwarehouse_userlogin");
      let res = await axios.patch(`${API_URL}/profile/address`, {
        address: address,
        province: provinceName,
        city: cityName,
        postalCode: postalCode,
        province_id: province_id,
        city_id: city_id
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (res.data.success) {
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setPostalCode()
        getAllLocation()
        setuuid("")
      }

    } catch (error) {
      console.log("ini error:", error);
      if (error.response.data.error) {
        toast({
          title: `${error.response.data.error[0].msg}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }

  //------------------Delete Address-------------//
  const onBtnDelete = async (uuid) => {
    try {
      let res = await axios.delete(`${API_URL}/profile/address`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      toast({
        title: `${res.data.message}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
      getAllLocation()
    } catch (error) {
      console.log(error);
    }
  }

  //--------------------Profile image Edit------------------//
  const userProfileImage = useSelector((state) => state.authReducer.profileImage);
  const img = useRef();
  const [profileImage, setProfileImage] = useState(null);

  const uploadImage = (event) => {
    console.log("ini isi dari event.target.files onchangefile :", event.target.files);
    toggleMenuImage()
    setProfileImage(event.target.files[0]);
  };

  const [showMenuImage, setShowMenuImage] = useState(false);
  const toggleMenuImage = () => {
    setShowMenuImage(!showMenuImage)
  }

  const hideMenuImage = () => {
    setShowMenuImage(false);
    setTimeout(() => {
      window.location.reload();
    }, 10);
    img.current.value = ""; // Clear the input field
  };

  const onBtnEditProfileImage = async () => {
    try {
      let token = localStorage.getItem("Gadgetwarehouse_userlogin");
      let formData = new FormData();
      //image max size is 1 MB
      if (profileImage.size > 1000000) {
        throw new Error("Image size should not exceed 1MB");
      }
      if (
        !["image/jpg", "image/png", "image/jpeg"].includes(profileImage.type)
      ) {
        throw new Error("Only .jpg, .png, webp and .jpeg format allowed!");
      }
      formData.append("image_profile", profileImage);
      console.log("ini isi dari formData", formData);
      console.log("ini tipe dari image_profile :", profileImage.type)
      let response = await axios.patch(`${API_URL}/profile/updateprofileimage`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response onbtneditprofileimage :", response);
      console.log("response onbtneditprofileimage message be :", response.data.message);
      // alert(response.data.message);
      toast({
        title: `${response.data.message}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      props.keeplogin(); //refresh immediately once profpic updated
    } catch (error) {
      console.log("ini error dari onBtnEditProfileImage : ", error);
      // alert(error.message);
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }


  return (

    // ----------------------------------profileImage---------------------
    <div className='relative mt-32 mb-8 gap-x-4 gap-y-4 bg-bgglass h-[850px] md:h-full w-full p-4 flex flex-col md:flex-row rounded-2xl backdrop-blur-md'>
      <div className='flex justify-center pt-2 bg-bgglass rounded-2xl md:w-[40%]'>
        <div className='flex flex-col items-center gap-4 md:gap-2 relative'>
          <img src={profileImage ? "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" : `${API_URL}${userProfileImage}`} alt="" className='w-[150px] md:w-[250px] md:h-[250px] h-[150px] rounded-2xl md:rounded-[100%]' />
          <div className='absolute right-12 md:top-5 md:right-6 flex justify-center items-center z-10 bg-white p-1 rounded-full'>
            <button className='bg-emerald-300 p-[2px] flex justify-center items-center w-10 h-10 rounded-full cursor-pointer' onClick={() => img.current.click()} >
              <BsCamera className='text-white' />
              <input className='hidden' type="file" ref={img} accept="image/*" onChange={uploadImage} />
            </button>
          </div>
          <div className='flex gap-6 md:gap-10 text-[#1BFD9C]'>
            <h3 className='text-sm md:text-lg font-semibold uppercase'>{nameUser}</h3>
            <h3 className='text-sm md:text-lg font-semibold uppercase'>{genderUser}</h3>
            <h3 className='text-sm md:text-lg font-semibold uppercase'>{phoneUser}</h3>
          </div>
          <div>
            <table>
              <thead className='text-emerald-300 flex gap-4'>
                <th>#</th>
                <th>Address</th>
                <th>Province</th>
                <th>City</th>
                <th>Postal Code</th>
              </thead>
              <tbody>
                {printPrimaryAddress()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* -----------------------Add edit Area----------------------- */}
      <div className=' flex flex-col gap-60'>
        <div>
          <table>
            <thead className='text-emerald-300 flex gap-10 w-full'>
              <th>Address</th>
            </thead>
            <tbody>
              {printAddress()}
            </tbody>
          </table>
        </div>

        <div className='info flex w-full items-start justify-between text-[#1BFD9C] md:gap-40'>
          <div className='flex justify-between gap-6 md:gap-10'>
            <button type='button' className='btnedit text-sm md:p-2 px-4 md-full bg-emerald-400 md:w-full font-bold cursor-pointer text-white hover:text-black hover:bg-emerald-300 hover:scale-105 duration-500 rounded-md md:rounded-xl md:py-2' onClick={toggleMenu} >Edit Profile</button>
            <button type='button' className='btnedit text-sm md:p-2 px-3 py-1 bg-emerald-400 md:w-full font-bold cursor-pointer text-white hover:text-black hover:bg-emerald-300 hover:scale-105 duration-500 rounded-md md:rounded-xl md:py-2' onClick={toggleMenuLocation}>Add Address</button>
          </div>

          {/* ---------------------Form Edit------------------ */}
          <div className={`formedit absolute md:w-1/4 flex items-center justify-center ${showMenu ? " right-24 md:right-4 md:bottom-20 top-[70%]" : "hidden"}`}>
            <div className="w-[90%] md:w-full  bg-bgglass backdrop-blur rounded-lg p-4 flex flex-col items-center justify-center gap-2 md:gap-4">

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
              <div className="w-full ">
                <select
                  onChange={(e) => setGender(e.target.value)}
                  className="outline-none w-full bg-transparent text-base border-b-2 border-emerald-300 p-2 rounded-md cursor-pointer"
                ><option value="Male" className='text-black'>Gender</option>
                  <option value="Male" className='text-black'>Male</option>
                  <option value="Female" className='text-black'>Female</option>
                </select>
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

              <div className="flex justify-between w-full">
                <button
                  className="md:w-auto border-none outline-none bg-emerald-400 px-2 md:px-4 md:py-2 rounded-lg md:text-sm text-white font-semibold hover:bg-emerald-300 hover:text-black hover:scale-105 duration-500"
                  onClick={saveProfile}>
                  Save
                </button>
                <button
                  type="button"
                  className="md:w-auto border-none outline-none bg-emerald-400 px-2 md:px-4 md:py-2 rounded-lg md:text-sm text-white font-semibold hover:bg-emerald-300 hover:text-black hover:scale-105 duration-500" onClick={btnCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------Address Location--------------------- */}
        <div className=' flex flex-col md:gap-20'>

          <div className=' flex md:gap-6 gap-4 justify-between'>

            {/* -----------------------Form add address----------------- */}
            <div className={`absolute mt-32 mb-8 md:gap-2 m-auto bg-bgglass md:w-1/4 p-2 flex flex-col rounded-2xl backdrop-blur-md ${showMenuLocation ? " md:right-5 md:top-20 top-[450px]" : "hidden"}`}>
              <h3 className='text-emerald-300 m-auto'>Add Your Address</h3>

              <div className='flex md:flex-col justify-between md:gap-2'>
                <div className='flex flex-col gap-2'>
                  <label className='text-[#1BFD9C]'>Province</label>
                  <select onChange={(e) => {
                    let index = e.nativeEvent.target.selectedIndex;
                    let label = e.nativeEvent.target[index].text;
                    let value = e.target.value;
                    setProvinceName(label)
                    setProvince_id(value)
                  }} placeholder="-- Select --" className=''>
                    {printProvince()}
                  </select>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-[#1BFD9C]'>City</label>
                  <select onChange={(e) => {
                    let index = e.nativeEvent.target.selectedIndex;
                    let label = e.nativeEvent.target[index].text;
                    let value = e.target.value;
                    setCityName(label)
                    setCity_id(value)
                  }} placeholder="-- Select --" className=''>
                    {printCity()}
                  </select>
                </div>


              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-[#1BFD9C]'>Postal Code</label>
                <input onChange={(e) => { setPostalCode(e.target.value); }} isDisabled={false} placeholder={postalCode} _placeholder={{ color: "black" }} defaultValue={postalCode} className='md:w-[38%]'>
                </input>
              </div>


              <div className="w-full py-2 border-b border-emerald-300 flex items-center gap-2">
                <FaHome className="text-[#1BFD9C] text-2xl" />
                <textarea
                  type="text"
                  required
                  maxlength="400"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your Address"
                  className=" overflow-y-hidden w-full h-[50px] py-3 text-lg bg-transparent outline-none border-none placeholder:text-[#1BFD9C] text-[#1BFD9C]"
                />
              </div>
              <div className='flex justify-between mt-2'>
                <button
                  type="button"
                  className="w-auto md:w-auto border-none outline-none bg-emerald-400 px-2 md:px-5 py-2 rounded-lg text-sm md:text-lg text-white font-semibold hover:bg-emerald-300 hover:text-black hover:scale-105 duration-500"
                  onClick={btnaddLocation}>
                  Save
                </button>
                <button
                  type="button"
                  className="w-auto border-none outline-none bg-emerald-400 px-2 md:px-5 py-2 rounded-lg text-sm md:text-lg text-white font-semibold hover:bg-emerald-300 hover:text-black hover:scale-105 duration-500"
                  onClick={hideMenuLocation}>
                  Cancel
                </button>
              </div>
            </div>

            <div className={`absolute mt-32 mb-8 md:gap-2 m-auto bg-bgglass md:w-1/4 p-2 flex flex-col rounded-2xl backdrop-blur-md ${showMenuLocationEdit ? " md:right-5 md:top-20 top-[450px]" : "hidden"}`}>
              <h3 className='text-emerald-300 m-auto'>Edit Your Address</h3>

              <div className='flex md:flex-col justify-between md:gap-2'>
                <div className='flex flex-col gap-2'>
                  <label className='text-[#1BFD9C]'>Province</label>
                  <select onChange={(e) => {
                    let index = e.nativeEvent.target.selectedIndex;
                    let label = e.nativeEvent.target[index].text;
                    let value = e.target.value;
                    setProvinceName(label)
                    setProvince_id(value)
                  }} placeholder="-- Select --" className=''>
                    {printProvince()}
                  </select>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-[#1BFD9C]'>City</label>
                  <select onChange={(e) => {
                    let index = e.nativeEvent.target.selectedIndex;
                    let label = e.nativeEvent.target[index].text;
                    let value = e.target.value;
                    setCityName(label)
                    setCity_id(value)
                  }} placeholder="-- Select --" className=''>
                    {printCity()}
                  </select>
                </div>


              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-[#1BFD9C]'>Postal Code</label>
                <input onChange={(e) => { setPostalCode(e.target.value); }} isDisabled={false} placeholder={postalCode} _placeholder={{ color: "black" }} defaultValue={postalCode} className='md:w-[38%]'>
                </input>
              </div>


              <div className="w-full py-2 border-b border-emerald-300 flex items-center gap-2">
                <FaHome className="text-[#1BFD9C] text-2xl" />
                <textarea
                  type="text"
                  required
                  maxlength="400"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your Address"
                  className=" overflow-y-hidden w-full h-[50px] py-3 text-lg bg-transparent outline-none border-none placeholder:text-[#1BFD9C] text-[#1BFD9C]"
                />
              </div>
              <div className='flex justify-between mt-2'>
                <button
                  type="button"
                  className="w-auto md:w-auto border-none outline-none bg-emerald-400 px-2 md:px-5 py-2 rounded-lg text-sm md:text-lg text-white font-semibold hover:bg-emerald-300 hover:text-black hover:scale-105 duration-500"
                  onClick={btneditAddress}>
                  Edit
                </button>
                <button
                  type="button"
                  className="w-auto border-none outline-none bg-emerald-400 px-2 md:px-5 py-2 rounded-lg text-sm md:text-lg text-white font-semibold hover:bg-emerald-300 hover:text-black hover:scale-105 duration-500"
                  onClick={hideMenuLocationEdit}>
                  Cancel
                </button>
              </div>
            </div>

            <div className={`absolute flex flex-col gap-2 p-2 bg-bgglass rounded-2xl ${showMenuImage ? " right-[164px]] md:right-4 md:bottom-5 bottom-5" : "hidden"}`}>
              <h1 className='text-center text-[#1BFD9C]'>Change Profile Photo</h1>
              <div>
                <img src={profileImage ? URL.createObjectURL(profileImage) : 'https://png.pngtree.com/png-vector/20190623/ourmid/pngtree-personalpersonalizationprofileuser-abstract-flat-color-ico-png-image_1491346.jpg'} className='object-cover w-40 md:w-52 rounded-lg' alt="" />
              </div>
              <div className='flex justify-between'>
                <button className='bg-emerald-400 hover:bg-emerald-300 text-white hover:text-black font-semibold hover:scale duration-500 rounded-xl px-2 py-1' onClick={onBtnEditProfileImage} >Save</button>
                <button className='bg-emerald-400 hover:bg-emerald-300 text-white hover:text-black font-semibold hover:scale duration-500 rounded-xl px-2 py-1' onClick={hideMenuImage}>Cancel</button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default CustomerProfile