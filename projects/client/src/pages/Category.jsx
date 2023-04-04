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
import { API_URL } from '../helper';
import axios from 'axios';
import Pagination from '../components/Pagination';
import { useSelector } from 'react-redux';

function Category() {

    const roleId = useSelector((state) => state.adminReducer.roleId)

    const modalAdd = useDisclosure();
    const modalEdit = useDisclosure();
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [page, setPage] = React.useState(0)   // const [size, setSize] = React.useState(5)

    let token = localStorage.getItem("gadgetwarehouse_adminlogin");

    React.useEffect(() => {
        getCategory()
    }, [page])

    //--------------------------------------- ADD CATEGORY ---------------------------------------------
    const [category, setCategory] = React.useState("");

    const btnSaveCategory = async () => {
        try {
            let res = await axios.post(`${API_URL}/category`, {
                name: category
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log(`res btnSaveCategory`, res);

            if (res.data.success) {
                alert(res.data.message)
                modalAdd.onClose();
                getCategory()
            }

        } catch (error) {
            console.log(error);
        }
    }

    const btnCancelAddCategory = () => {
        modalAdd.onClose()
        getCategory()
        setId()
        setCategory("")
    }

    //--------------------------------------- GET ALL CATEGORY ---------------------------------------------


    // const [sortby, setSortby] = React.useState("type")
    // const [order, setOrder] = React.useState("ASC")
    // const [type, setType] = React.useState("")
    let size = 5
    let sortby = "type"
    let order = "ASC"
    let type = ""
    const [categoryList, setCategoryList] = React.useState([]);
    const [totalData, setTotalData] = React.useState(0);

    const getCategory = async () => {
        try {
            let res = await axios.get(`${API_URL}/category/?page=${page}&size=${size}&sortby=${sortby}&order=${order}&type=${type}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            // console.log(`res getCategory`, res);

            setCategoryList(res.data.data)
            setTotalData(res.data.datanum)

        } catch (error) {
            console.log(error);
        }
    }

    const printCategory = () => {
        console.log(`categorylist`, categoryList);
        return categoryList.map((val, idx) => {
            return (
                <Tr textColor={"white"}>
                    <Td>{idx + 1}</Td>
                    <Td>{val.type}</Td>
                    <Td textColor={val.isDisabled == true ? "red.500" : "green.500"}>{val.isDisabled == false ? "Available" : "Unavailable"}</Td>
                    {
                        roleId == 1 ?
                            <Td>
                                <Button
                                    _hover={"none"}
                                    isDisabled={val.isDisabled}
                                    bgColor={"#1BFD9C"}
                                    style={{ color: "black" }}
                                    onClick={() => onBtnEdit(
                                        val.type,
                                        val.id
                                    )}
                                >
                                    Edit
                                </Button>

                                <Switch
                                    ml={2}
                                    colorScheme={"green"}
                                    size='lg'
                                    defaultChecked={val.isDisabled}
                                    onChange={() => deleteCategory(val.id)}
                                />

                            </Td>
                            : null
                    }
                </Tr >
            )
        })
    }

    // ------------------------------ PAGINATION ------------------------------------

    const paginate = (pageNumber) => {
        console.log(`pagenumber`, pageNumber.selected);
        setPage(pageNumber.selected)
    }

    // ------------------------------ DELETE CATEGORY ------------------------------------

    const deleteCategory = async (id) => {
        try {
            let res = await axios.delete(`${API_URL}/category/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(`res deleteAdmin`, res);

            if (res.data.success) {
                getCategory()
            }


        } catch (error) {
            console.log(error);
        }
    }

    // ------------------------------ EDIT CATEGORY ------------------------------------

    const [id, setId] = React.useState();
    const onBtnEdit = (
        type,
        id
    ) => {
        modalEdit.onOpen()
        setCategory(type)
        setId(id)
    }

    const btnSaveEditCategory = async () => {

        try {
            let res = await axios.patch(`${API_URL}/category/${id}`, {
                type: category
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log(`res btnSaveEditCategory`, res);
            if (res.data.success) {
                alert(res.data.message);
                modalEdit.onClose();
                getCategory();
                setId()
                setCategory("")
            }


        } catch (error) {
            console.log(error);
        }
    }

    const btnCancelEditCategory = () => {
        modalEdit.onClose()
        getCategory()
        setId()
        setCategory("")
    }

    return (
        <Box my={"20px"} textColor="white">
            <Flex justifyContent={'space-between'}>
                <Heading size={"lg"} fontStyle="inherit" >
                    Category List
                </Heading>
                <Button onClick={modalAdd.onOpen} _hover={"none"} bgColor={"#1BFD9C"} style={{ color: "black" }} leftIcon={<MdOutlineAdd />}>
                    Add Category
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
                    <ModalHeader>New Category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl >
                            <FormLabel>Category Name</FormLabel>
                            <Input
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>


                    <ModalFooter>
                        <Button
                            colorScheme='blue'
                            mr={3}
                            onClick={btnSaveCategory}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={btnCancelAddCategory}
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
                    <ModalHeader>Edit Category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Category Name</FormLabel>
                            <Input
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder={"User Name"}
                                defaultValue={category}
                            />
                        </FormControl>
                    </ModalBody>


                    <ModalFooter>
                        <Button
                            onClick={btnSaveEditCategory}
                            colorScheme='blue'
                            mr={3}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={btnCancelEditCategory}
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
                            <Th textColor={"white"}>Category Name</Th>
                            <Th textColor={"white"}>Status</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody >
                        {printCategory()}
                    </Tbody>


                </Table>
            </TableContainer>

            {
                <div className='justify-end flex'>
                    <Pagination paginate={paginate} size={size} totalData={totalData} />

                </div>

            }
        </Box>
    );
}

export default Category;