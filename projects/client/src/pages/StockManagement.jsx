import {
    Box,
    Button,
    Flex,
    FormControl,
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
    Spinner,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineRequestPage, MdProductionQuantityLimits } from 'react-icons/md';
import axios from "axios";
import { API_URL } from '../helper';
import { useSelector } from 'react-redux';
import RequestStock from '../components/requestStock';
import SendStock from '../components/sendStock';

function StockManagement() {

    const modalRequest = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    let token = localStorage.getItem("gadgetwarehouse_adminlogin");
    const roleId = useSelector((state) => state.adminReducer.roleId);
    const warehouseId = useSelector((state) => state.adminReducer.warehouseId);
    const [loading, setLoading] = React.useState(true);
    const toast = useToast();

    const [productList, setProductList] = React.useState([]);
    const [colorList, setColorList] = React.useState([]);
    const [MemoryList, setMemoryList] = React.useState([]);
    const [warehouseList, setWarehouseList] = React.useState([]);
    const [allWarehouseList, setAllWarehouseList] = React.useState([]);
    const [productId, setProductId] = React.useState();
    const [colorId, setColorId] = React.useState();
    const [memoryId, setMemoryId] = React.useState();
    const [fromId, setFromId] = React.useState();
    const [toId, setToId] = React.useState();
    const [stock, setStock] = React.useState();

    const [request, setRequest] = React.useState([]);
    const [send, setSend] = React.useState([]);

    const getAllProduct = async () => {
        try {
            let res = await axios.get(`${API_URL}/mutation/all-product`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(`getAllProduct :`, res);
            setProductList(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const printAllProduct = () => {
        return productList.map((val, idx) => {
            return (
                <option value={val.id}>{val.name}</option>
            )
        })
    }

    const getAllColor = async () => {
        try {
            let res = await axios.get(`${API_URL}/product/color`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(`getAllcolor res:`, res);
            setColorList(res.data.data)

        } catch (error) {
            console.log(error);
        }
    }

    const printAllColor = () => {
        return colorList.map((val, idx) => {
            return (
                <option value={val.value}>{val.label}</option>
            )
        })
    }

    const getAllMemory = async () => {
        try {
            let res = await axios.get(`${API_URL}/product/memory`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(`getAllMemory res:`, res);
            setMemoryList(res.data.data)

        } catch (error) {
            console.log(error);
        }
    }

    const printAllMemory = () => {
        return MemoryList.map((val, idx) => {
            return (
                <option value={val.value}>{val.label}</option>
            )
        })
    }

    const getWarehouse = async () => {
        try {
            let res = await axios.post(`${API_URL}/mutation/warehouse`, {
                productId: productId,
                colorId: colorId,
                memoryId: memoryId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(`getWarehouse: `, res);

            setWarehouseList(res.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllWarehouse = async () => {
        try {
            let res = await axios.get(`${API_URL}/warehouse/all-warehouse`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("getAllWarehouse", res.data);
            setAllWarehouseList(res.data)

        } catch (error) {
            console.log(error);
        }
    }

    const printWarehouse = () => {
        return warehouseList.map((val, idx) => {
            return (
                val.warehouseId != warehouseId ?
                    <option value={val.warehouseId}>{val.warehouse.name}</option> : null
            )
        })
    };

    const printAllWarehouse = () => {
        return allWarehouseList.map((val, idx) => {
            return (
                <option value={val?.id}>{val?.name}</option>
            )
        })
    }

    React.useEffect(() => {
        getAllProduct();
        getAllColor();
        getAllMemory();
        getRequest();
        getSend();
        getAllWarehouse();
    }, []);

    React.useEffect(() => {
        getWarehouse();
    }, [productId, colorId, memoryId])

    //------------------------------- BTN SEND REQUEST STOCK ----------------------------

    const btnSendRequest = async () => {
        try {
            if (roleId == 1) {
                let res = await axios.post(`${API_URL}/mutation/request`, {
                    productId: productId,
                    colorId: colorId,
                    memoryId: memoryId,
                    warehouseRequest: toId, // WH A -> YANG MINTA
                    warehouseSend: fromId, // WH B -> YANG DI MINTA
                    stock: stock
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log(`btnSendRequest`, res);

                if (res.data.success) {
                    alert(res.data.message);
                    setProductId();
                    setColorId();
                    setMemoryId();
                    setFromId();
                    setToId();
                    setStock();
                    getSend();
                    getRequest();
                    modalRequest.onClose()
                }
            } else {
                let res = await axios.post(`${API_URL}/mutation/request`, {
                    productId: productId,
                    colorId: colorId,
                    memoryId: memoryId,
                    warehouseRequest: warehouseId, // WH A -> YANG MINTA
                    warehouseSend: fromId, // WH B -> YANG DI MINTA
                    stock: stock
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log(`btnSendRequest`, res);

                if (res.data.success) {
                    alert(res.data.message);
                    setProductId();
                    setColorId();
                    setMemoryId();
                    setFromId();
                    setStock();
                    getSend();
                    getRequest();
                    modalRequest.onClose()
                }
            }

        } catch (error) {
            console.log(error);
            toast({
                title: "cek kembali input yang anda masukin",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }

    };

    const btnCancelRequest = () => {
        setProductId();
        setColorId();
        setMemoryId();
        setFromId();
        setToId();
        setStock();
        getSend();
        getRequest();
        modalRequest.onClose()
    }

    //------------------------------- GET REQUEST STOCK ----------------------------------

    const getRequest = async () => {
        try {
            if (warehouseId) {
                let res = await axios.get(`${API_URL}/mutation/get-request?warehouseId=${warehouseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                // console.log(`getRequest :`, res.data.data);

                setRequest(res.data.data)
                setLoading(false);
            } else {
                let res = await axios.get(`${API_URL}/mutation/get-request?warehouseId`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(`getRequest :`, res);

                setRequest(res.data.data)
                setLoading(false);
            }


        } catch (error) {
            console.log(error);
        }
    }

    const printRequest = () => {
        // console.log(`request`, request);
        return request.map((val, idx) => {
            if (roleId == 1) {
                return <RequestStock
                    idx={idx}
                    from={val?.warehouse.name}
                    to={val?.type.warehouse.name}
                    product={val?.type.product.name}
                    color={val?.type.color.color}
                    memory={val?.type.memory.memory}
                    request={val?.addition}
                    status={val?.status.status}
                    accept={() => btnAccept(
                        val?.id,
                        val?.type.productId,
                        val?.type.colorId,
                        val?.type.memoryId,
                        val?.addition,
                        val?.type.warehouseId,
                        val?.supplierId
                    )}
                    reject={() => btnReject(
                        val?.id
                    )}
                />
            } else {
                return <RequestStock
                    idx={idx}
                    from={val?.type.warehouse.name}
                    product={val?.type.product.name}
                    color={val?.type.color.color}
                    memory={val?.type.memory.memory}
                    request={val?.addition}
                    status={val?.status.status}
                    accept={() => btnAccept(
                        val?.id,
                        val?.type.productId,
                        val?.type.colorId,
                        val?.type.memoryId,
                        val?.addition,
                        val?.type.warehouseId
                    )}
                    reject={() => btnReject(
                        val?.id
                    )}
                />
            }
        })
    }

    //------------------------------- GET SEND STOCK -------------------------------------

    const getSend = async () => {
        try {
            if (warehouseId) {
                let res = await axios.get(`${API_URL}/mutation/get-send?warehouseId=${warehouseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log("getSend", res.data.data);
                setSend(res.data.data)

            } else {
                let res = await axios.get(`${API_URL}/mutation/get-send?warehouseId`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log("getSend", res.data.data);
                setSend(res.data.data)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const printSend = () => {
        return send.map((val, idx) => {
            if (roleId == 1) {
                return <SendStock
                    idx={idx}
                    from={val?.warehouse.name}
                    to={val?.type.warehouse.name}
                    product={val?.type.product.name}
                    color={val?.type.color.color}
                    memory={val?.type.memory.memory}
                    request={val?.addition}
                    status={val?.status.status}
                />
            } else {
                return <SendStock
                    idx={idx}
                    from={val?.warehouse.name}
                    product={val?.type.product.name}
                    color={val?.type.color.color}
                    memory={val?.type.memory.memory}
                    request={val?.addition}
                    status={val?.status.status}
                />
            }
        })
    };

    const btnAccept = async (id, productId, colorId, memoryId, addition, warehouseRequest, warehouseSend) => {
        try {
            if (roleId == 1) {
                let res = await axios.patch(`${API_URL}/mutation/accept-request/${id}`, {
                    productId,
                    colorId,
                    memoryId,
                    warehouseId: warehouseSend,
                    request: addition,
                    warehouseRequest
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log(`btnAccept`, res);

                if (res.data.success == true) {
                    alert(res.data.message);
                    getRequest()
                }
            } else {
                let res = await axios.patch(`${API_URL}/mutation/accept-request/${id}`, {
                    productId,
                    colorId,
                    memoryId,
                    warehouseId: warehouseId,
                    request: addition,
                    warehouseRequest
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log(`btnAccept`, res);

                if (res.data.success == true) {
                    alert(res.data.message);
                    getRequest()
                }
            }



        } catch (error) {
            console.log(error);
            if (error.response.data.success == false) {
                alert(error.response.data.message);
                getRequest()
            }
        }
    };

    const btnReject = async (id) => {
        try {
            let res = await axios.delete(`${API_URL}/mutation/reject-request/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(`btnReject`, res);
            if (res.data.success) {
                alert(res.data.message);
                getRequest();
            }

        } catch (error) {
            console.log(error);
        }
    }

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
                <Box mt={{ md: "20px", lg: "20px", xl: "20px" }} textColor="white">
                    <Flex justifyContent={"space-between"}>
                        <Heading size={{ md: "md", lg: "lg" }} fontStyle="inherit">
                            Stock Management
                        </Heading>
                        <Flex gap={"8px"}>
                            <Button
                                onClick={modalRequest.onOpen}
                                _hover={"none"}
                                bgColor={"#1BFD9C"}
                                style={{ color: "black" }}
                                leftIcon={<MdOutlineRequestPage />}
                                size={{ md: "sm", lg: "md" }}
                            >
                                Request
                            </Button>
                        </Flex>
                    </Flex>

                    <Tabs mt={"20px"} isFitted variant='enclosed'>
                        <TabList mb='1em'>
                            <Tab>Incoming Request</Tab>
                            <Tab>Waiting For Confirmation</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <TableContainer>
                                    <Table>
                                        <Thead>
                                            <Tr>
                                                <Th textColor={"white"}>No</Th>
                                                {
                                                    roleId == 1 ? <Th textColor={"white"}>From</Th> : <Th textColor={"white"}>Warehouse</Th>
                                                }
                                                {
                                                    roleId == 1 ? <Th textColor={"white"}>To</Th> : null
                                                }
                                                <Th textColor={"white"}>Product</Th>
                                                <Th textColor={"white"}>Color</Th>
                                                <Th textColor={"white"}>Memory</Th>
                                                <Th textColor={"white"}>Request</Th>
                                                <Th textColor={"white"}>Status</Th>
                                                <Th></Th>
                                            </Tr>
                                        </Thead>
                                        {printRequest()}
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                            <TabPanel>
                                <TableContainer>
                                    <Table>
                                        <Thead>
                                            <Tr>
                                                <Th textColor={"white"}>No</Th>
                                                {
                                                    roleId == 1 ? <Th textColor={"white"}>From</Th> : <Th textColor={"white"}>Warehouse</Th>
                                                }
                                                {
                                                    roleId == 1 ? <Th textColor={"white"}>To</Th> : null
                                                }
                                                <Th textColor={"white"}>Product</Th>
                                                <Th textColor={"white"}>Color</Th>
                                                <Th textColor={"white"}>Memory</Th>
                                                <Th textColor={"white"}>Request</Th>
                                                <Th textColor={"white"}>Status</Th>
                                            </Tr>
                                        </Thead>
                                        {printSend()}
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>


                    {/* MODAL REQUEST STOCK */}
                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={modalRequest.isOpen}
                        onClose={modalRequest.onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Request Stock Product</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <Box>
                                    <FormControl>
                                        <FormLabel>Product</FormLabel>
                                        <Select
                                            onChange={(e) => {
                                                setProductId(e.target.value);
                                            }}
                                            placeholder={"-- Select --"}
                                        >
                                            {printAllProduct()}
                                        </Select>
                                    </FormControl>

                                    <FormControl mt={2}>
                                        <FormLabel>Color</FormLabel>
                                        <Select
                                            onChange={(e) => {
                                                setColorId(e.target.value);
                                            }}
                                            placeholder={"-- Select --"}
                                        >
                                            {printAllColor()}
                                        </Select>
                                    </FormControl>

                                    <FormControl mt={2}>
                                        <FormLabel>Memory</FormLabel>
                                        <Select
                                            onChange={(e) => {
                                                setMemoryId(e.target.value);
                                            }}
                                            placeholder={"-- Select --"}
                                        >
                                            {printAllMemory()}
                                        </Select>
                                    </FormControl>

                                    {
                                        roleId == 1 ?
                                            <FormControl mt={2}>
                                                <FormLabel>From</FormLabel>
                                                <Select
                                                    onChange={(e) => {
                                                        setFromId(e.target.value)
                                                    }}
                                                    placeholder={"-- Select --"}
                                                >
                                                    {printWarehouse()}
                                                </Select>
                                            </FormControl> : <FormControl mt={2}>
                                                <FormLabel>Warehouse</FormLabel>
                                                <Select
                                                    onChange={(e) => {
                                                        setFromId(e.target.value)
                                                    }}
                                                    placeholder={"-- Select --"}
                                                >
                                                    {printWarehouse()}
                                                </Select>
                                            </FormControl>
                                    }

                                    {
                                        roleId == 1 ?
                                            <FormControl mt={2}>
                                                <FormLabel>To</FormLabel>
                                                <Select
                                                    onChange={(e) => {
                                                        setToId(e.target.value)
                                                    }}
                                                    placeholder={"-- Select --"}
                                                >
                                                    {printAllWarehouse()}
                                                </Select>
                                            </FormControl> : null
                                    }

                                    <FormControl mt={2} isRequired>
                                        <FormLabel>Stock</FormLabel>
                                        <Input
                                            type={"number"}
                                            onChange={(e) => {
                                                setStock(e.target.value);
                                            }}
                                            placeholder="Stock"
                                            isRequired={true}
                                            required
                                        />
                                    </FormControl>
                                </Box>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={btnSendRequest} colorScheme="blue" mr={3}>
                                    Send
                                </Button>
                                <Button onClick={btnCancelRequest}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </Box>
            )}
        </>

    );
}

export default StockManagement;