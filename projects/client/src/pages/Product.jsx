import React from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Spinner,
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
import { MdCancel, MdOutlineAdd, MdPhone, MdSearch, MdImage, MdDeleteForever } from "react-icons/md";
import Pagination from '../components/Pagination';
import { API_URL } from '../helper';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import uploadImg from "../img/1156518-200.png"
import { useNavigate } from 'react-router-dom';

function Product() {

    const modalAdd = useDisclosure();
    const modalEdit = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [page, setPage] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    const [category, setCategory] = React.useState([]);
    const [productName, setProductName] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [categoryId, setCategoryId] = React.useState(0);
    const [description, setDescription] = React.useState("");
    const [variations, setVariations] = React.useState([]);
    const [warehouseList, setWarehouseList] = React.useState([]);
    // const [warehouseId, setWarehouseId] = React.useState(0);

    const [isLoading, setIsLoading] = React.useState(false);
    const [optionsColor, setOptionsColor] = React.useState([]);
    // const [valueColor, setValueColor] = React.useState([]);

    const [optionsMemory, setOptionsMemory] = React.useState([]);
    // const [valueMemory, setValueMemory] = React.useState(null);

    let size = 8
    let sortby = "name"
    let order = "ASC"
    let name = ""
    const [productList, setProductList] = React.useState([]);
    const [totalData, setTotalData] = React.useState(0);

    const [fileProduct, setFileProduct] = React.useState(null);
    const [fileProductEdit, setFileProductEdit] = React.useState("");
    const [fileProductEditNew, setFileProductEditNew] = React.useState(null);

    const [isDisabled, setIsDisabled] = React.useState(true)
    const [activeIndex, setActiveIndex] = React.useState(null)

    const roleId = useSelector((state) => state.adminReducer.roleId)
    const warehouseId = useSelector((state) => state.adminReducer.warehouseId)

    let token = localStorage.getItem("gadgetwarehouse_adminlogin");

    React.useEffect(() => {
        getCategory();
        getProduct();
        getAllWarehouse();
        getColor();
        getMemory();
    }, [page])


    //------------------------------- GET ALL CATEGORY -------------------------------------------

    const getCategory = async () => {
        try {
            let res = await axios.get(`${API_URL}/category`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            // console.log(`getCategory`, res);
            setCategory(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const printCategory = () => {
        // console.log(`category`, category);  
        return category.map((val, idx) => {
            return (
                <option value={val.id} >
                    {val.type}
                </option>
            )
        })
    }

    //------------------------------- SAVE PRODUCT AND CANCEL -------------------------------------------

    const btnSaveAddProduct = async () => {
        try {
            let formData = new FormData();
            formData.append(
                "data",
                JSON.stringify({
                    name: productName,
                    categoryId: categoryId,
                    description: description,
                    variations: variations,
                })
            )

            if (fileProduct != null) {
                formData.append("images", fileProduct);
            }

            console.log(`add variation`, variations);
            console.log(`formData`, formData);
            let res = await axios.post(`${API_URL}/product`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log(`btnSaveAddProduct`, res);

            if (res.data.success) {
                alert(res.data.message);
                getProduct();
                setProductName("");
                setCategoryId();
                setDescription("");
                setVariations([]);
                setFileProduct(null)
                modalAdd.onClose();
            }

        } catch (error) {
            console.log(error);
            alert(error.response.data.message)
        }
    }

    const onBtnCancelModalAdd = () => {
        modalAdd.onClose()
        setCategoryId(0)
        setProductName("")
        setPrice(0)
        setDescription("")
        setVariations([])
    }

    //------------------------------- GET PRODUCT -------------------------------------------

    const getProduct = async () => {
        try {
            let res = await axios.get(`${API_URL}/product/?page=${page}&size=${size}&sortby=${sortby}&order=${order}&name=${name}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log(`res getProduct`, res);
            setProductList(res.data.data)
            setTotalData(res.data.datanum)
            setLoading(false);
            if (!res.data) {
                navigate("*");
            }

        } catch (error) {
            console.log(error);
        }
    }

    const printProduct = () => {
        console.log(`productList`, productList);
        return productList.map((val, idx) => {
            return (
                <Tr textColor={"white"}>
                    <Td>{idx + 1}</Td>
                    <Td>
                        {<Image width={"75px"} src={`${API_URL}${val.productImage}`} />}
                    </Td>
                    <Td>{val.name}</Td>
                    <Td>{val.category.type}</Td>
                    <Td>
                        {`Rp. ${val.types[0].price} - ${val.types[val.types.length - 1].price}`}

                    </Td>
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
                                        val.id,
                                        val.productImage,
                                        val.name,
                                        val.categoryId,
                                        val.description,
                                    )}
                                >
                                    Edit
                                </Button>

                                <Switch
                                    ml={2}
                                    colorScheme={"green"}
                                    size='lg'
                                    defaultChecked={val.isDisabled}
                                    onChange={() => deleteProduct(val.id)}
                                />

                            </Td>
                            :
                            <Td>
                                <Button
                                    _hover={"none"}
                                    isDisabled={val.isDisabled}
                                    bgColor={"#1BFD9C"}
                                    style={{ color: "black" }}
                                    onClick={() => onBtnEdit(
                                        val.id,
                                        val.productImage,
                                        val.name,
                                        val.categoryId,
                                        val.description,
                                    )}
                                >
                                    Edit
                                </Button>
                            </Td>
                    }
                </Tr >
            )
        })
    }

    //------------------------------- DELETE PRODUCT -------------------------------------------

    const deleteProduct = async (id) => {
        try {
            let res = await axios.delete(`${API_URL}/product/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(`res deleteAdmin`, res);

            if (res.data.success) {
                getProduct()
            }

        } catch (error) {
            console.log(error);
        }
    }

    // ------------------------------ PAGINATION -----------------------------------------

    const paginate = (pageNumber) => {
        console.log(`pagenumber`, pageNumber.selected);
        setPage(pageNumber.selected)
    }

    // ----------------------------- VARIATION -------------------------------------------

    const addVariation = () => {
        const newVariaton = {
            id: variations.length + 1,
            colorId: null,
            memoryId: null,
            warehouseId: null,
            price: 0,
            stock: 0
        }
        setVariations([...variations, newVariaton])
    }

    const RemoveVariation = (idx) => {
        console.log("cek delete", idx);
        // const updatedVariations = variations.filter((variation) => variation.id !== id);
        let temp = [...variations]
        temp.splice(idx, 1)

        setVariations(temp);
    };

    const handleVariationChangeColor = (idx, colorId) => {
        let temp = [...variations]
        temp[idx].colorId = colorId
        setVariations(temp);
    };

    const handleVariationChangeMemory = (idx, memoryId) => {
        let temp = [...variations]
        temp[idx].memoryId = memoryId
        setVariations(temp);
    };

    const handleVariationChangePrice = (idx, price) => {
        let temp = [...variations]
        temp[idx].price = price
        setVariations(temp);
    };

    const handleVariationChangeWarehouse = (idx, warehouseId) => {
        let temp = [...variations]
        temp[idx].warehouseId = warehouseId
        setVariations(temp);
    };

    const handleVariationChangeStock = (idx, stock) => {
        let temp = [...variations]
        temp[idx].stock = stock
        setVariations(temp);
    };

    //-------------------------------- GET WAREHOUSE ------------------------------------

    const getAllWarehouse = async () => {
        try {
            if (roleId == 1) {
                let res = await axios.get(`${API_URL}/warehouse/allwarehouse`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                // console.log(`getAllWarehouse`, res);
                setWarehouseList(res.data)
            } else {
                let res = await axios.get(`${API_URL}/warehouse/allwarehouse?warehouseId=${warehouseId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                // console.log(`getAllWarehouse`, res);
                setWarehouseList(res.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const printAllWarehouse = () => {
        // console.log(`warehouseList`, warehouseList);
        return warehouseList.map((val, idx) => {
            return (
                <option value={val.id} >
                    {val.name}
                </option>
            )
        })
    }
    //-------------------------------- Creatable Color ------------------------------------

    const getColor = async () => {
        try {
            let get = await axios.get(`${API_URL}/product/color`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setOptionsColor(get.data.data);

        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateColor = async (inputValue) => {
        try {
            let add = await axios.post(`${API_URL}/product/color`, {
                color: inputValue
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(`createColor`, add);

        } catch (error) {
            console.log(error);
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            getColor()
        }, 1000);
    };

    //-------------------------------- Creatable Memory ------------------------------------

    const getMemory = async () => {
        try {
            let get = await axios.get(`${API_URL}/product/memory`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setOptionsMemory(get.data.data);

        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateMemory = async (inputValue) => {
        try {
            let add = await axios.post(`${API_URL}/product/memory`, {
                memory: inputValue
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(`createMemory`, add);

        } catch (error) {
            console.log(error);
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            getMemory()
        }, 1000);
    };

    //-------------------------------- Add Product Image ------------------------------------

    const inputFile = React.useRef(null);

    const onChangeFile = (event) => {
        // const files = [event.target.files];
        // const overSize = checkFileSize(files);
        // if (overSize) {
        //     alert(`You can only upload files that are lower than 2MB in size.`);
        // } else {
        //     setFileProduct(event.target.files);
        // }
        setFileProduct(event.target.files[0]);
    };

    // ------------------------------ EDIT VARIANT ------------------------------------

    const [variationsEdit, setVariationsEdit] = React.useState([]);
    const [productId, setProductId] = React.useState()
    const onBtnEdit = async (
        id,
        productImage,
        name,
        categoryId,
        description,
    ) => {
        try {
            modalEdit.onOpen()
            setCategoryId(categoryId)
            setProductName(name)
            setDescription(description)
            setFileProductEdit(productImage)
            setProductId(id)
            if (roleId == 1) {
                let res = await axios.get(`${API_URL}/product/variant?id=${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setVariationsEdit(res.data.data);
            } else {
                let res = await axios.get(`${API_URL}/product/variant?id=${id}&warehouseId=${warehouseId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setVariationsEdit(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addVariationEdit = () => {
        const newVariaton = {
            // id: variationsEdit.length + 1,
            colorId: null,
            memoryId: null,
            warehouseId: null,
            price: 0,
            stock: 0
        }
        setVariationsEdit([...variationsEdit, newVariaton])
    }

    const RemoveVariationEdit = (idx) => {
        console.log("cek delete", idx);
        // const updatedVariations = variations.filter((variation) => variation.id !== id);
        let temp = [...variationsEdit]
        temp.splice(idx, 1)

        setVariationsEdit(temp);
    };

    const handleVariationChangeColorEdit = (idx, colorId) => {
        let temp = [...variationsEdit]
        temp[idx].colorId = colorId
        setVariationsEdit(temp);
    };

    const handleVariationChangeMemoryEdit = (idx, memoryId) => {
        let temp = [...variationsEdit]
        temp[idx].memoryId = memoryId
        setVariationsEdit(temp);
    };

    const handleVariationChangePriceEdit = (idx, price) => {
        let temp = [...variationsEdit]
        temp[idx].price = price
        setVariationsEdit(temp);
    };

    const handleVariationChangeDiscountEdit = (idx, discount) => {
        let temp = [...variationsEdit]
        temp[idx].discount = discount
        setVariationsEdit(temp);
    };

    const handleVariationChangeWarehouseEdit = (idx, warehouseId) => {
        let temp = [...variationsEdit]
        temp[idx].warehouseId = warehouseId
        setVariationsEdit(temp);
    };

    const handleVariationChangeStockEdit = (idx, stock) => {
        let temp = [...variationsEdit]
        temp[idx].stock = stock
        setVariationsEdit(temp);
    };

    const onChangeFileEdit = (event) => {
        setFileProductEditNew(event.target.files[0]);
    };

    const btnSaveEditProduct = async () => {
        try {
            let formData = new FormData();
            formData.append(
                "data",
                JSON.stringify({
                    name: productName,
                    categoryId: categoryId,
                    description: description,
                    variationsEdit: variationsEdit,
                })
            )

            if (fileProductEditNew != null) {
                formData.append("images", fileProductEditNew);
            }

            console.log(`formData`, formData);

            let res = await axios.patch(`${API_URL}/product/?id=${productId}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (res.data.success) {
                alert(res.data.message);
                getProduct();
                setProductName("");
                setCategoryId();
                setDescription("");
                setVariationsEdit([]);
                modalEdit.onClose();
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.message)
        }
    };

    const onBtnCancelModalEdit = () => {
        modalEdit.onClose()
        setCategoryId()
        setProductName("")
        setPrice()
        setDescription("")
        setVariationsEdit([])
    };

    const editVariant = async () => {
        try {
            let res = await axios.patch(`${API_URL}/product/variant/${activeIndex.id}`, {
                price: activeIndex.price,
                stock: activeIndex.stock,
                discount: activeIndex.discount,
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(`editVariant`, res);
            if (res.data.success) {
                alert(res.data.message);
                setActiveIndex(null)
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {loading === true ? (
                <Flex
                    justifyContent={"center"}
                    my={{ base: "24", md: "96" }}
                    color={"white"}
                    maxW={"100vw"}
                    mx={"auto"}
                >
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                    />
                </Flex>
            ) : (
                <Box my={"20px"} textColor="white">
                    <Flex justifyContent={'space-between'}>
                        <Heading size={"lg"} fontStyle="inherit" >
                            Product List
                        </Heading>
                        <Flex>
                            {
                                roleId == 1 ?
                                    <Button onClick={modalAdd.onOpen} _hover={"none"} bgColor={"#1BFD9C"} style={{ color: "black" }} leftIcon={<MdOutlineAdd />}>
                                        Add Product
                                    </Button> : null
                            }
                        </Flex>
                    </Flex>

                    {/* ----------------------------------------------MODAL ADD------------------------------------------------ */}
                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={modalAdd.isOpen}
                        onClose={modalAdd.onClose}
                        size={"6xl"}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>New Product</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <Flex justifyContent={'space-between'}>
                                    <Box w={"19%"}>
                                        <FormControl >
                                            <FormLabel>Product Name</FormLabel>
                                            <Input
                                                type={"text"}
                                                onChange={(e) => setProductName(e.target.value)}
                                                placeholder={"Product Name"}
                                            />
                                        </FormControl>

                                        <FormControl mt={2}  >
                                            <Flex alignItems={"center"}>
                                                <FormLabel>Product Image</FormLabel>
                                                {
                                                    !fileProduct ? null :
                                                        <Button
                                                            variant={"unstyled"}
                                                            onClick={() => setFileProduct(null)}
                                                        >
                                                            {<MdDeleteForever fontSize={20} />}
                                                        </Button>
                                                }
                                            </Flex>

                                            <Image
                                                src={!fileProduct ? uploadImg :
                                                    URL.createObjectURL(fileProduct)}
                                                style={{
                                                    width: "75px", height: "75px", aspectRatio: "1/1", objectFit: "contain"
                                                }}
                                                onClick={() => {
                                                    inputFile.current.click()
                                                }}
                                            />
                                            <input
                                                type="file"
                                                id='file'
                                                ref={inputFile}
                                                style={{ display: "none" }}
                                                onChange={onChangeFile}
                                            />
                                        </FormControl>

                                        <FormControl mt={2}>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onChange={(e) => setCategoryId(e.target.value)}
                                                placeholder={"-- Select --"}
                                            >
                                                {printCategory()}
                                            </Select>

                                        </FormControl>

                                        <FormControl mt={2}>
                                            <FormLabel>Description</FormLabel>
                                            <Textarea
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder='Description'
                                                maxLength={300}
                                                resize={'none'}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box
                                        // border={"1px solid red" }
                                        h={"350px"}
                                        w={"80%"}
                                        overflowX={"hidden"}
                                        overflow="auto"
                                    >
                                        <TableContainer>
                                            <Table size='sm'>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Color</Th>
                                                        <Th>Memory</Th>
                                                        <Th>Price</Th>
                                                        <Th>Warehouse</Th>
                                                        <Th>Stock</Th>
                                                        <Th>
                                                            {<IconButton
                                                                onClick={addVariation}
                                                                variant='link'
                                                                size={'md'}
                                                                textColor={"black"}
                                                                icon={<MdOutlineAdd />}
                                                            />
                                                            }
                                                        </Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        variations.map((variation, idx) => (
                                                            <Tr key={variation.id}>
                                                                <Td>
                                                                    {
                                                                        <CreatableSelect
                                                                            menuPosition='fixed'
                                                                            isClearable
                                                                            isDisabled={isLoading}
                                                                            isLoading={isLoading}
                                                                            onChange={(newValue) => handleVariationChangeColor(idx, newValue)}
                                                                            onCreateOption={handleCreateColor}
                                                                            options={optionsColor}
                                                                            // value={variation.colorId}
                                                                            defaultValue={variation.colorId}
                                                                        />
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        <CreatableSelect
                                                                            menuPosition='fixed'
                                                                            isClearable
                                                                            isDisabled={isLoading}
                                                                            isLoading={isLoading}
                                                                            onChange={(newValue) => handleVariationChangeMemory(idx, newValue)}
                                                                            onCreateOption={handleCreateMemory}
                                                                            options={optionsMemory}
                                                                            // value={valueMemory}
                                                                            defaultValue={variation.memoryId}
                                                                        />
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        <Input
                                                                            size={"sm"}
                                                                            width="24"
                                                                            variant={"filled"}
                                                                            onChange={(e) => handleVariationChangePrice(idx, e.target.value)}
                                                                        />
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {<Select
                                                                        size={"sm"}
                                                                        variant={"filled"}
                                                                        onChange={(e) => handleVariationChangeWarehouse(idx, e.target.value)}
                                                                        placeholder={"-- Select --"}
                                                                    >
                                                                        {printAllWarehouse()}
                                                                    </Select>
                                                                    }
                                                                </Td>
                                                                <Td>{<Input size={"sm"} width="24" variant={"filled"} onChange={(e) => handleVariationChangeStock(idx, e.target.value)} />}</Td>
                                                                <Td>
                                                                    {
                                                                        <Button
                                                                            onClick={() => RemoveVariation(idx)}
                                                                            size={"sm"}
                                                                            variant={"outline"}
                                                                            colorScheme={"red"}
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    }
                                                                </Td>
                                                            </Tr>
                                                        ))
                                                    }

                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Flex>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme='blue'
                                    mr={3}
                                    onClick={btnSaveAddProduct}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={onBtnCancelModalAdd}
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
                        size={"6xl"}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Edit Product</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <Flex justifyContent={'space-between'}>
                                    <Box w={"18%"}>
                                        <FormControl >
                                            <FormLabel>Product Name</FormLabel>
                                            <Input
                                                type={"text"}
                                                onChange={(e) => setProductName(e.target.value)}
                                                placeholder={"Product Name"}
                                                defaultValue={productName}

                                            />
                                        </FormControl>

                                        <FormControl mt={2}  >
                                            <Flex alignItems={"center"}>
                                                <FormLabel>Product Image</FormLabel>
                                                {
                                                    !fileProductEdit ? null :
                                                        <Button
                                                            variant={"unstyled"}
                                                            onClick={() => setFileProductEdit(null)}
                                                        >
                                                            {<MdDeleteForever fontSize={20} />}
                                                        </Button>
                                                }
                                            </Flex>

                                            <Image
                                                src={
                                                    fileProductEditNew ? URL.createObjectURL(fileProductEditNew) : `${API_URL}${fileProductEdit}`
                                                }
                                                style={{
                                                    width: "80px", height: "80px", aspectRatio: "1/1", objectFit: "contain"
                                                }}
                                                onClick={() => {
                                                    inputFile.current.click()
                                                }}
                                            />
                                            <input
                                                type="file"
                                                id='file'
                                                ref={inputFile}
                                                style={{ display: "none" }}
                                                onChange={onChangeFileEdit}
                                            />
                                        </FormControl>

                                        <FormControl mt={2}>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onChange={(e) => setCategoryId(e.target.value)}
                                                placeholder={"-- Select --"}
                                                defaultValue={categoryId}
                                            >
                                                {printCategory()}
                                            </Select>

                                        </FormControl>

                                        <FormControl mt={2}>
                                            <FormLabel>Description</FormLabel>
                                            <Textarea
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder='Description'
                                                maxLength={300}
                                                resize={'none'}
                                                defaultValue={description}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box
                                        // border={"1px solid red" }
                                        h={"350px"}
                                        w={"81%"}
                                        overflowX={"hidden"}
                                        overflow="auto"
                                    >
                                        <TableContainer >
                                            <Table size='sm'>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Color</Th>
                                                        <Th>Memory</Th>
                                                        <Th>Price</Th>
                                                        <Th>Disc (%)</Th>
                                                        <Th>Warehouse</Th>
                                                        <Th>Stock</Th>
                                                        {/* <Th>Status</Th> */}
                                                        <Th>
                                                            {<IconButton
                                                                onClick={addVariationEdit}
                                                                variant='link'
                                                                size={'md'}
                                                                textColor={"black"}
                                                                icon={<MdOutlineAdd />}
                                                            />
                                                            }
                                                        </Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        variationsEdit.map((variationEdit, idx) => (

                                                            <Tr key={variationEdit.id}>
                                                                <Td>
                                                                    {
                                                                        <CreatableSelect
                                                                            menuPosition='fixed'
                                                                            isClearable
                                                                            isLoading={isLoading}
                                                                            onChange={(newValue) => handleVariationChangeColorEdit(idx, newValue)}
                                                                            onCreateOption={handleCreateColor}
                                                                            options={optionsColor}
                                                                            // value={1}
                                                                            // defaultValue={(colorList) => { console.log(`colorlist`, colorList); }}
                                                                            defaultInputValue={() => {
                                                                                let value = optionsColor.filter(val => variationEdit.colorId == val.value)
                                                                                if (value.length) {
                                                                                    return value[0].label
                                                                                } else {
                                                                                    return null
                                                                                }
                                                                            }}
                                                                        />
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        <CreatableSelect
                                                                            menuPosition='fixed'
                                                                            isClearable
                                                                            isDisabled={isLoading}
                                                                            isLoading={isLoading}
                                                                            onChange={(newValue) => handleVariationChangeMemoryEdit(idx, newValue)}
                                                                            onCreateOption={handleCreateMemory}
                                                                            options={optionsMemory}
                                                                            // value={valueMemory}
                                                                            // defaultValue={variationEdit.memoryId}
                                                                            defaultInputValue={() => {
                                                                                let value = optionsMemory.filter(val => variationEdit.memoryId == val.value)
                                                                                if (value.length) {
                                                                                    return value[0].label
                                                                                } else {
                                                                                    return null
                                                                                }
                                                                            }}
                                                                        // disabled={variationEdit.id == isDisabled}
                                                                        // isDisabled={variationEdit.id ? isDisabled : !isDisabled}
                                                                        />
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        <Input
                                                                            size={"sm"}
                                                                            width="24"
                                                                            variant={"filled"}
                                                                            onChange={(e) => handleVariationChangePriceEdit(idx, e.target.value)}
                                                                            defaultValue={variationEdit.price}
                                                                            disabled={activeIndex?.id != variationEdit?.id ? isDisabled : !isDisabled}
                                                                        />
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        <Input
                                                                            size={"sm"}
                                                                            width="12"
                                                                            variant={"filled"}
                                                                            onChange={(e) => handleVariationChangeDiscountEdit(idx, e.target.value)}
                                                                            defaultValue={variationEdit.discount}
                                                                            disabled={activeIndex?.id != variationEdit?.id ? isDisabled : !isDisabled}
                                                                        />
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        <Select
                                                                            size={"sm"}
                                                                            variant={"filled"}
                                                                            onChange={(e) => handleVariationChangeWarehouseEdit(idx, e.target.value)}
                                                                            placeholder={"-- Select --"}
                                                                            defaultValue={variationEdit.warehouseId}
                                                                            disabled={variationEdit.id ? true : false}
                                                                        >
                                                                            {printAllWarehouse()}
                                                                        </Select>
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        <Input
                                                                            size={"sm"}
                                                                            width="14"
                                                                            variant={"filled"}
                                                                            onChange={(e) => handleVariationChangeStockEdit(idx, e.target.value)}
                                                                            defaultValue={variationEdit.stock}
                                                                            disabled={activeIndex?.id != variationEdit?.id ? isDisabled : !isDisabled}
                                                                        />
                                                                    }
                                                                </Td>
                                                                {/* <Td>
                                                            {
                                                                variationEdit.status.status
                                                            }
                                                        </Td> */}
                                                                <Td>
                                                                    {
                                                                        !variationEdit.id ? (
                                                                            <Button
                                                                                onClick={() => RemoveVariationEdit(idx)}
                                                                                size={"sm"}
                                                                                ml={1}
                                                                                variant={"outline"}
                                                                                colorScheme={"red"}
                                                                            >
                                                                                Remove
                                                                            </Button>
                                                                        ) :
                                                                            activeIndex?.id == variationEdit?.id ?
                                                                                <>
                                                                                    <Button
                                                                                        onClick={() => editVariant()}
                                                                                        size={"sm"}
                                                                                        variant={"outline"}
                                                                                        colorScheme={"blue"}
                                                                                    >
                                                                                        Save
                                                                                    </Button>
                                                                                    <Button
                                                                                        onClick={() => {
                                                                                            // setIsDisabled(!isDisabled);
                                                                                            setActiveIndex(null)
                                                                                        }}
                                                                                        size={"sm"}
                                                                                        ml={1}
                                                                                        variant={"outline"}
                                                                                        colorScheme={"red"}
                                                                                    >
                                                                                        Cancel
                                                                                    </Button>
                                                                                </> : <>
                                                                                    <Button
                                                                                        onClick={() => {
                                                                                            // setIsDisabled(isDisabled)
                                                                                            setActiveIndex(variationEdit)
                                                                                        }}
                                                                                        size={"sm"}
                                                                                        variant={"outline"}
                                                                                        colorScheme={"blue"}
                                                                                    >
                                                                                        Edit
                                                                                    </Button>
                                                                                    <Button
                                                                                        onClick={() => RemoveVariationEdit(idx)}
                                                                                        size={"sm"}
                                                                                        ml={1}
                                                                                        variant={"outline"}
                                                                                        colorScheme={"red"}
                                                                                    >
                                                                                        Remove
                                                                                    </Button>
                                                                                </>
                                                                    }


                                                                </Td>
                                                            </Tr>
                                                        ))
                                                    }

                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Flex>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme='blue'
                                    mr={3}
                                    onClick={() => { btnSaveEditProduct() }}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={onBtnCancelModalEdit}
                                >
                                    Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    <TableContainer mt={"20px"}>
                        <Table>
                            <Thead>
                                <Tr >
                                    <Th textColor={"white"}>No</Th>
                                    <Th textColor={"white"}>Product Image</Th>
                                    <Th textColor={"white"}>Product Name</Th>
                                    <Th textColor={"white"}>Product Category</Th>
                                    <Th textColor={"white"}>Price</Th>
                                    <Th textColor={"white"}>Status</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {printProduct()}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    {
                        <div className='justify-end flex'>
                            <Pagination
                                paginate={paginate} size={size} totalData={totalData}
                            />
                        </div>
                    }
                </Box >
            )}
        </>
    );
}

export default Product;