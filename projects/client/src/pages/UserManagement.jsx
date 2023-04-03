import React from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Textarea,
    Th,
    Thead,
    Tr,
    useDisclosure
} from '@chakra-ui/react';
import { MdOutlineAdd, MdPhone, MdSearch } from "react-icons/md"
import axios from 'axios';
import { API_URL } from '../helper';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useSelector } from 'react-redux';


function UserManagement() {

    const roleId = useSelector((state) => state.adminReducer.roleId)
    const name = useSelector((state) => state.adminReducer.name)

    const modalAdd = useDisclosure();
    const modalEdit = useDisclosure();
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)


    let token = localStorage.getItem("gadgetwarehouse_adminlogin");

    const [visible, setVisible] = React.useState("password");
    const klik = () => {
        if (visible === "password") {
            setVisible("text")
        } else {
            setVisible("password")
        }
    }

    React.useEffect(() => {
        getAllAdmin();
        getAllWarehouse();
    }, [])

    //-------------------------- GET ALL ADMIN ----------------------------------
    const [adminList, setAdminList] = React.useState([]);

    const getAllAdmin = async () => {
        try {
            let res = await axios.get(`${API_URL}/admin/alladmin`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            // console.log(`getAllAdmin`, res.data.data);

            setAdminList(res.data.data)

        } catch (error) {
            console.log(error);
        }
    }

    const printAllAdmin = () => {
        console.log(`admin`, adminList);
        return adminList.map((val, idx) => {
            return (
                <Tr textColor={"white"}>
                    <Td>{idx + 1}</Td >
                    <Td>{val.name}</Td >
                    <Td>{val.email}</Td>
                    <Td>{val.phone}</Td>
                    <Td>{val.warehouse == null ? "all warehouse" : val.warehouse.name}</Td>
                    <Td>{val.roleId == 1 ? "Super Admin" : "Admin"}</Td>
                    <Td textColor={val.isDeleted == true ? "red.500" : "green.500"}>{val.isDeleted == false ? "Available" : "Unavailable"}</Td>
                    {
                        roleId == 1 ?
                            // disini nanti tambahin, jika roleId nya sama maka button delete nya hilang 
                            <Td>
                                
                                <Button
                                    _hover={"none"}
                                    isDisabled={val.isDeleted}
                                    bgColor={"#1BFD9C"}
                                    style={{ color: "black" }}
                                    onClick={() => onBtnEdit(
                                        val.name,
                                        val.email,
                                        val.phone,
                                        val.password,
                                        val.uuid,
                                        val.gender,
                                        val.warehouseId,
                                        val.roleId
                                    )}
                                >
                                    Edit
                                </Button>

                                {/* <Button
                                    ml={2}
                                    _hover={"none"}
                                    bgColor={val.isDeleted == false ? "red.500" : "blue.500"}
                                    style={{ color: "#E9F8F9" }}
                                    onClick={() => deleteAdmin(val.uuid)}
                                >
                                    {val.isDeleted == false ? "Disable" : "Enable"}
                                </Button> */}

                                {
                                    name == val.name ? null : (
                                        val.isDeleted == false ? <Switch
                                            ml={2}
                                            colorScheme={"red"}
                                            size='lg'
                                            onChange={() => deleteAdmin(val.uuid)}
                                        /> : <Switch
                                            ml={2}
                                            colorScheme={"red"}
                                            size='lg'
                                            defaultChecked
                                            onChange={() => deleteAdmin(val.uuid)}
                                        />
                                    )
                                }
                            </Td>
                            : null
                    }
                </Tr >
            )
        })
    }

    //------------------------------ ADD ADMIN (SAVE AND CANCEL) ----------------------------------

    const [username, setUsername] = React.useState(" ");
    const [email, setEmail] = React.useState(" ");
    const [password, setPassword] = React.useState(" ");
    const [phone, setPhone] = React.useState(" ");
    const [gender, setGender] = React.useState(" ");
    const [warehouse, setWarehouse] = React.useState();
    const [role, setRole] = React.useState();

    const isErrorUsername = username == "";
    const isErrorEmail = email == "";
    const isErrorPassword = password == "";
    const isErrorPhone = phone == "";

    const btnSaveAddAdmin = async () => {
        try {
            let res = await axios.post(`${API_URL}/auth/admin/register`, {
                name: username,
                gender: gender,
                phone: phone,
                email: email,
                password: password,
                roleId: role,
                warehouseId: warehouse

            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log(`btnSaveAdmin`, res);
            if (res.data.success) {
                alert(res.data.message);
                modalAdd.onClose();
                getAllAdmin()
                setUsername("")
                setEmail("")
                setPassword("")
                setPhone("")
                setGender("")
                setWarehouse()
                setRole()
            }

        } catch (error) {
            console.log(error);
            if (error.response.data.error) {
                alert(error.response.data.error[0].msg)
            }
        }
    }

    const btnCancelAddAdmin = () => {
        modalAdd.onClose()
        getAllAdmin()
        setUsername(" ")
        setEmail(" ")
        setPassword(" ")
        setPhone(" ")
        setGender(" ")
        setWarehouse()
        setRole()
        setVisible("password")
    }

    //------------------------------- GET ALL WAREHOUSE -------------------------------------------
    const [warehouseList, setWarehouseList] = React.useState([])

    const getAllWarehouse = async () => {
        try {
            let res = await axios.get(`${API_URL}/warehouse/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            // console.log(`getAllWarehouse`, res);
            setWarehouseList(res.data)

        } catch (error) {
            console.log(error);
        }
    }

    const printAllWarehouse = () => {
        console.log(`warehouseList`, warehouseList);
        return warehouseList.map((val, idx) => {
            return (
                <option value={val.id} >
                    {val.name}
                </option>
            )
        })
    }

    //------------------------------- DELETE ADMIN -------------------------------------------

    const deleteAdmin = async (uuid) => {
        try {
            let res = await axios.delete(`${API_URL}/admin/${uuid}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(`res deleteAdmin`, res);

            if (res.data.success) {
                // alert(res.data.message)
                getAllAdmin()
            }


        } catch (error) {
            console.log(error);
        }
    }

    //------------------------------- EDIT ADMIN -------------------------------------------

    const [uuid, setUuid] = React.useState("")
    // console.log(`warehouseName`, warehouseName);

    const onBtnEdit = (
        name,
        email,
        phone,
        password,
        uuid,
        gender,
        warehouseId,
        roleId
    ) => {
        modalEdit.onOpen()
        setUsername(name)
        setEmail(email)
        setPhone(phone)
        setPassword(password)
        setUuid(uuid)
        setGender(gender)
        setWarehouse(warehouseId)
        setRole(roleId)
    }

    const btnSaveEditAdmin = async () => {

        try {
            let res = await axios.patch(`${API_URL}/admin/${uuid}`, {
                name: username,
                email: email,
                phone: phone,
                gender: gender,
                password: password,
                warehouseId: warehouse,
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log(`res btnSaveEditAdmin`, res);
            if (res.data.success) {
                alert(res.data.message);
                modalEdit.onClose();
                getAllAdmin()
                setUsername("")
                setEmail("")
                setPassword("")
                setPhone("")
                setGender("")
                setWarehouse()
                setRole()
            }


        } catch (error) {
            console.log(error);
        }
    }

    const btnCancelEditAddAdmin = () => {
        modalEdit.onClose()
        getAllAdmin()
        setUsername("")
        setEmail("")
        setPassword("")
        setPhone("")
        setGender("")
        setWarehouse()
        setRole()
        setVisible("password")
    }

    return (
        <Box my={"20px"} textColor="white">
            <Flex justifyContent={'space-between'}>
                <Heading size={"lg"} fontStyle="inherit" >
                    User List
                </Heading>
                <Button onClick={modalAdd.onOpen} _hover={"none"} bgColor={"#1BFD9C"} style={{ color: "black" }} leftIcon={<MdOutlineAdd />}>
                    Add User
                </Button>
            </Flex>

            {/* ----------------------------------------------MODAL ADD------------------------------------------------ */}
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={modalAdd.isOpen}
                onClose={modalAdd.onClose}
                size={"xl"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Flex>
                            <Box>
                                <FormControl isInvalid={isErrorUsername}>
                                    <FormLabel>User Name</FormLabel>
                                    <Input
                                        type={"text"}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder={"User Name"}
                                    />
                                    {!isErrorUsername ? (
                                        <FormHelperText />
                                    ) : (
                                        <FormErrorMessage>Username is required.</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl mt={2} isInvalid={isErrorEmail} >
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type={"email"}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={"Email"}
                                    />
                                    {!isErrorEmail ? (
                                        <FormHelperText />
                                    ) : (
                                        <FormErrorMessage>Email is required.</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl mt={2} isInvalid={isErrorPassword}>
                                    <FormLabel>Password</FormLabel>
                                    <Flex>
                                        <Input
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={visible}
                                            placeholder={"Password"}
                                        >
                                        </Input>
                                        <Button
                                            bgColor={"white"}
                                            _hover={"none"}
                                            fontSize={'xl'}
                                            onClick={klik}
                                        >
                                            {visible === 'password' ? <HiEyeOff /> : <HiEye />}
                                        </Button>
                                    </Flex>

                                    {!isErrorPassword ? (
                                        <FormHelperText />
                                    ) : (
                                        <FormErrorMessage>Password is required.</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl isInvalid={isErrorPhone}>
                                    <FormLabel>Phone</FormLabel>
                                    <Input
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={"Phone"}
                                    />
                                    {!isErrorPhone ? (
                                        <FormHelperText />
                                    ) : (
                                        <FormErrorMessage>Phone is required.</FormErrorMessage>
                                    )}
                                </FormControl>
                            </Box>

                            <Box pl={4}>
                                <FormControl >
                                    <FormLabel>Gender</FormLabel>
                                    <Select
                                        onChange={(e) => setGender(e.target.value)}
                                        placeholder={"-- Select --"}
                                    >
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                    </Select>

                                </FormControl>

                                {
                                    role == "2" ?
                                        <FormControl mt={2}>
                                            <FormLabel>Warehouse</FormLabel>
                                            <Select
                                                placeholder={"-- Select --"}
                                                onChange={(e) => setWarehouse(e.target.value)}
                                            >
                                                {printAllWarehouse()}
                                            </Select >
                                        </FormControl> : null
                                }

                                <FormControl mt={2}>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        placeholder={"-- Select --"}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value='1'>Super Admin</option>
                                        <option value='2'>Admin</option>
                                    </Select >
                                </FormControl>

                            </Box>
                        </Flex>
                    </ModalBody>


                    <ModalFooter>
                        <Button
                            onClick={() => btnSaveAddAdmin()}
                            colorScheme='blue'
                            mr={3}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={btnCancelAddAdmin}
                        >
                            Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* ----------------------------------------------MODAL EDIT------------------------------------------------ */}
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={modalEdit.isOpen}
                onClose={modalEdit.onClose}
                size={"xl"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Flex>
                            <Box>
                                <FormControl>
                                    <FormLabel>User Name</FormLabel>
                                    <Input
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder={"User Name"}
                                        defaultValue={username}
                                    />
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={"Email"}
                                        defaultValue={email}
                                    />
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Password</FormLabel>
                                    <Flex>
                                        <Input
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={visible}
                                            placeholder={"Password"}
                                            defaultValue={password}

                                        >
                                        </Input>
                                        <Button
                                            bgColor={"white"}
                                            _hover={"none"}
                                            fontSize={'xl'}
                                            onClick={klik}
                                        >
                                            {visible === 'password' ? <HiEyeOff /> : <HiEye />}
                                        </Button>
                                    </Flex>

                                </FormControl>

                                <FormControl >
                                    <FormLabel>Phone</FormLabel>
                                    <Input
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={"Phone"}
                                        defaultValue={phone}
                                    />
                                </FormControl>
                            </Box>

                            <Box pl={4}>
                                <FormControl >
                                    <FormLabel>Gender</FormLabel>
                                    <Select
                                        onChange={(e) => setGender(e.target.value)}
                                        placeholder={"-- Select --"}
                                        defaultValue={gender}
                                    >
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                    </Select>

                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Warehouse</FormLabel>
                                    <Select
                                        placeholder={"-- Select --"}
                                        onChange={(e) => setWarehouse(e.target.value)}
                                        defaultValue={warehouse}
                                    >
                                        {printAllWarehouse()}
                                    </Select >
                                </FormControl>

                                <FormControl mt={2}>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        placeholder={"-- Select --"}
                                        onChange={(e) => setRole(e.target.value)}
                                        defaultValue={role}
                                    >
                                        <option value='1'>Super Admin</option>
                                        <option value='2'>Admin</option>
                                    </Select >
                                </FormControl>

                            </Box>
                        </Flex>
                    </ModalBody>


                    <ModalFooter>
                        <Button
                            onClick={() => btnSaveEditAdmin()}
                            colorScheme='blue'
                            mr={3}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={btnCancelEditAddAdmin}
                        >
                            Cancel</Button>
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
                            <Th textColor={"white"}>Warehouse</Th>
                            <Th textColor={"white"}>Role</Th>
                            <Th textColor={"white"}>Status</Th>
                            {
                                roleId == 1 ? <Th></Th> : null
                            }
                        </Tr>
                    </Thead>
                    <Tbody >
                        {printAllAdmin()}
                    </Tbody>

                </Table>
            </TableContainer>
        </Box>
    );
}

export default UserManagement;