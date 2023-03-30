import React from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure
} from '@chakra-ui/react';
import axios from 'axios';
import { MdOutlineAdd, MdPhone, MdSearch } from "react-icons/md"
import { API_URL } from '../helper';

function Warehouse() {
    // const { isOpen, onOpen, onClose } = useDisclosure();

    const modalAdd = useDisclosure();
    const modalEdit = useDisclosure();

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    //----------------------GET PROVINCE AND CITY-----------------------------------------------------------------------------------------

    const [province, setProvince] = React.useState([])
    const [provinceName, setProvinceName] = React.useState("")
    const [provinceId, setProvinceId] = React.useState("")
    const [city, setCity] = React.useState([])
    const [cityName, setCityName] = React.useState("")
    const [postalCode, setPostalCode] = React.useState()
    // const [province_id, setProvince_id] = React.useState()
    const [city_id, setCity_id] = React.useState("")

    const getProvince = async () => {
        try {
            let res = await axios.get(`${API_URL}/rajaongkir/province`)
            // console.log(`ini res getProvince`, res.data.rajaongkir.results);

            setProvince(res.data.rajaongkir.results)

        } catch (error) {
            console.log("error getProvince", error);
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


    React.useEffect(() => {
        getProvince();
        getCity();
        getAllWarehouse();
        // console.log(`ini city id`, city_id);
    }, [provinceId])

    const printProvince = () => {
        // console.log(`province`, province);
        return province.map((val, idx) => {
            return (
                <option value={`${val.province_id}, ${val.province}`}>{val.province}</option>
            )
        })
    }

    const printCity = () => {
        console.log(`ini dari city`, city);
        return city.map((val, idx) => {
            return (
                <option value={`${val.city_name}, ${val.postal_code}, ${val.city_id}`}>{val.city_name}</option>
            )
        })
    }

    const onBtnCancelModalAdd = () => {
        modalAdd.onClose()
        setPostalCode(null)
    }


    //--------------------SAVE AND CANCEL WAREHOUSE------------------------
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [address, setAddress] = React.useState("");

    const btnSaveWarehouse = async () => {
        try {
            let res = await axios.post(`${API_URL}/warehouse/`, {
                name: name,
                email: email,
                address: address,
                province: provinceName,
                city: cityName,
                postalCode: postalCode,
                phone: phone,
                provinceId: provinceId,
                city_id: city_id
            }, {

            })
            // console.log(`ini dari resp addnewuser`, res);

            if (res.data.success) {
                alert(res.data.message);
                modalAdd.onClose();
                setPostalCode(null)
                getAllWarehouse()
            }

        } catch (error) {
            console.log("ini error addnewuser :", error);
        }
    }

    //----------------------------GET ALL WAREHOUSE--------------------------------------------------------

    const [warehouseList, setWarehouseList] = React.useState([])

    const getAllWarehouse = async () => {
        try {
            let res = await axios.get(`${API_URL}/warehouse/`, {

            })
            // console.log(`getallwarehouse`, res.data);
            setWarehouseList(res.data)

        } catch (error) {
            console.log(error);
        }
    }

    const printWarehouse = () => {
        // console.log(`ini dari warehouselist`, warehouseList);
        return warehouseList.map((val, idx) => {
            return (
                <Tr textColor={"white"}>
                    <Td>{idx + 1}</Td >
                    <Td>{val.name}</Td >
                    <Td>{val.email}</Td>
                    <Td>{val.phone}</Td>
                    <Td>{val.address}, {val.city}, {val.province}, {val.postalCode}</Td>
                    <Td>
                        <Button onClick={() => onBtnEdit(val.name, val.email, val.phone, val.address, val.city, val.postalCode, val.province, val.province_id, val.city_id)} _hover={"none"} bgColor={"#1BFD9C"} style={{ color: "black" }}>Edit</Button>
                        <Button ml={2} _hover={"none"} bgColor={"#537FE7"} style={{ color: "#E9F8F9" }}>Delete</Button>
                    </Td>
                </Tr>
            )
        })
    }

    //------------------------ EDIT WAREHOUSE ------------------------
    const onBtnEdit = (name, email, phone, address, city, postalCode, province, provinceId, city_id) => {
        modalEdit.onOpen()
        setName(name)
        setEmail(email)
        setPhone(phone)
        setAddress(address)
        setCityName(city)
        setPostalCode(postalCode)
        setProvinceId(provinceId)
        setCity_id(city_id)
    }

    return (
        <Box m={"40px"} textColor="white">
            <Heading size={"lg"} fontStyle="inherit" >
                Warehouse List
            </Heading>

            <Button onClick={modalAdd.onOpen} mt={"28px"} _hover={"none"} bgColor={"#1BFD9C"} style={{ color: "black" }} leftIcon={<MdOutlineAdd />}>
                Add Warehouse
            </Button>
            {/* ----------------------------------------------MODAL ADD-------------------------------------------------------------------------------------------------- */}
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={modalAdd.isOpen}
                onClose={modalAdd.onClose}
                size={"xl"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Warehouse</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Flex>
                            <Box>
                                <FormControl>
                                    <FormLabel>Warehouse Name</FormLabel>
                                    <Input onChange={(e) => { setName(e.target.value) }} ref={initialRef} placeholder='Warehouse Name' />
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Email</FormLabel>
                                    <Input onChange={(e) => { setEmail(e.target.value) }} placeholder='Email' />
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Phone</FormLabel>
                                    <Input onChange={(e) => { setPhone(e.target.value) }} placeholder='Phone' />
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Province</FormLabel>
                                    <Select onChange={(e) => {
                                        setProvinceId(e.target.value.split(",")[0]);
                                        setProvinceName(e.target.value.split(",")[1]);
                                    }}
                                        placeholder={"-- Select --"}>
                                        {printProvince()}
                                    </Select >
                                </FormControl>
                            </Box>

                            <Box pl={4}>
                                <FormControl >
                                    <FormLabel>City</FormLabel>
                                    <Select
                                        onChange={(e) => {
                                            setCityName(e.target.value.split(",")[0]);
                                            setPostalCode(e.target.value.split(",")[1]);
                                            setCity_id(e.target.value.split(",")[2]);
                                        }}
                                        placeholder={"-- Select --"}
                                    >
                                        {printCity()}
                                    </Select >
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Address</FormLabel>
                                    <Input onChange={(e) => { setAddress(e.target.value) }} placeholder='Address' />

                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Postal Code</FormLabel>
                                    <Input isDisabled={true} placeholder={postalCode} _placeholder={{ opacity: 1, color: "black" }}>

                                    </Input>
                                </FormControl>
                            </Box>
                        </Flex>
                    </ModalBody>


                    <ModalFooter>
                        <Button onClick={btnSaveWarehouse} colorScheme='blue' mr={3}>
                            Save
                        </Button>
                        <Button onClick={onBtnCancelModalAdd}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* ----------------------------------------------MODAL EDIT-------------------------------------------------------------------------------------------------- */}
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={modalEdit.isOpen}
                onClose={modalEdit.onClose}
                size={"xl"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Warehouse</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Flex>
                            <Box>
                                <FormControl>
                                    <FormLabel>Warehouse Name</FormLabel>
                                    <Input defaultValue={name} onChange={(e) => { setName(e.target.value) }} ref={initialRef} placeholder='Warehouse Name' />
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Email</FormLabel>
                                    <Input defaultValue={email} onChange={(e) => { setEmail(e.target.value) }} placeholder='Email' />
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Phone</FormLabel>
                                    <Input defaultValue={phone} onChange={(e) => { setPhone(e.target.value) }} placeholder='Phone' />
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Province</FormLabel>
                                    <Select onChange={(e) => {
                                        setProvinceId(e.target.value.split(",")[0]);
                                        setProvinceName(e.target.value.split(",")[1]);
                                    }}
                                    defaultValue={cityName}
                                    >
                                        {printProvince()}
                                    </Select >
                                </FormControl>
                            </Box>

                            <Box pl={4}>
                                <FormControl >
                                    <FormLabel>City</FormLabel>
                                    <Select
                                        onChange={(e) => {
                                            setCityName(e.target.value.split(",")[0]);
                                            setPostalCode(e.target.value.split(",")[1]);
                                        }}
                                    >
                                        {printCity()}
                                    </Select >
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Address</FormLabel>
                                    <Input onChange={(e) => { setAddress(e.target.value) }} placeholder='Address' defaultValue={address} />

                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Postal Code</FormLabel>
                                    <Input isDisabled={true} placeholder={postalCode} _placeholder={{ opacity: 1, color: "black" }} defaultValue={postalCode}>

                                    </Input>
                                </FormControl>
                            </Box>
                        </Flex>
                    </ModalBody>


                    <ModalFooter>
                        <Button onClick={btnSaveWarehouse} colorScheme='blue' mr={3}>
                            Save
                        </Button>
                        <Button onClick={onBtnCancelModalAdd}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* <InputGroup mt={"28px"} w={{ sm: "40", md: "96", lg: "96" }}>
                <InputLeftElement pointerEvents="none" children={<MdSearch size={"22"} color='gray.800' />} />
                <Input type="text" placeholder="Search List" bg="white" color="gray.800" />
            </InputGroup> */}

            <TableContainer mt={"20px"}>
                <Table>
                    <Thead>
                        <Tr >
                            <Th textColor={"white"}>No</Th>
                            <Th textColor={"white"}>Name</Th>
                            <Th textColor={"white"}>Email</Th>
                            <Th textColor={"white"}>Phone</Th>
                            <Th textColor={"white"}>Address</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody >

                        {printWarehouse()}

                    </Tbody>

                </Table>
            </TableContainer>
        </Box>
    );
}

export default Warehouse;