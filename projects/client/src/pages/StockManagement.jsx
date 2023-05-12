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
    useDisclosure
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
    const warehouseId = useSelector((state) => state.adminReducer.warehouseId);

    const [productList, setProductList] = React.useState([]);
    const [colorList, setColorList] = React.useState([]);
    const [MemoryList, setMemoryList] = React.useState([]);
    const [warehouseList, setWarehouseList] = React.useState([]);
    const [productId, setProductId] = React.useState();
    const [colorId, setColorId] = React.useState();
    const [memoryId, setMemoryId] = React.useState();
    const [whId, setWhId] = React.useState();
    const [stock, setStock] = React.useState();

    const [request, setRequest] = React.useState([]);
    const [send, setSend] = React.useState([]);

    const getAllProduct = async () => {
        try {
            let res = await axios.get(`${API_URL}/stockmutation/allproduct`, {
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
            let res = await axios.post(`${API_URL}/stockmutation/warehouse`, {
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

    const printWarehouse = () => {
        return warehouseList.map((val, idx) => {
            return (
                val.warehouseId != warehouseId ?
                    <option value={val.warehouseId}>{val.warehouse.name}</option> : null
            )
        })
    }

    React.useEffect(() => {
        getAllProduct();
        getAllColor();
        getAllMemory();
        getRequest();
        getSend();
    }, []);

    React.useEffect(() => {
        getWarehouse();
    }, [productId, colorId, memoryId])

    //------------------------------- BTN SEND REQUEST STOCK ----------------------------

    const btnSendRequest = async () => {
        try {
            let res = await axios.post(`${API_URL}/stockmutation/request`, {
                productId: productId,
                colorId: colorId,
                memoryId: memoryId,
                warehouseRequest: warehouseId, // WH A -> YANG MINTA
                warehouseSend: whId, // WH B -> YANG DI MINTA
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
                setWhId();
                setStock();
                getSend();
                modalRequest.onClose()
            }

        } catch (error) {
            console.log(error);
        }

    }

    //------------------------------- GET REQUEST STOCK ----------------------------------

    const getRequest = async () => {
        try {
            let res = await axios.get(`${API_URL}/stockmutation/getrequest/${warehouseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(`getRequest :`, res.data.data);

            setRequest(res.data.data)

        } catch (error) {
            console.log(error);
        }
    }

    const printRequest = () => {
        return request.map((val, idx) => {
            return <RequestStock
                idx={idx}
                from={val.type.warehouse.name}
                product={val.type.product.name}
                color={val.type.color.color}
                memory={val.type.memory.memory}
                request={val.addition}
                status={val.status.status}
                accept={() => btnAccept(
                    val.id,
                    val.type.productId,
                    val.type.colorId,
                    val.type.memoryId,
                    val.addition,
                    val.type.warehouseId
                )}
                reject={() => btnReject(
                    val.id
                )}
            />
        })
    }

    //------------------------------- GET SEND STOCK -------------------------------------

    const getSend = async () => {
        try {
            let res = await axios.get(`${API_URL}/stockmutation/getsend/${warehouseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("getSend", res.data.data);
            setSend(res.data.data)

        } catch (error) {
            console.log(error);
        }
    }

    const printSend = () => {
        return send.map((val, idx) => {
            return <SendStock
                idx={idx}
                to={val.warehouse.name}
                product={val.type.product.name}
                color={val.type.color.color}
                memory={val.type.memory.memory}
                request={val.addition}
                status={val.status.status}
            />
        })
    };

    const btnAccept = async (id, productId, colorId, memoryId, addition, warehouseRequest) => {
        try {
            let res = await axios.patch(`${API_URL}/stockmutation/acceptrequest/${id}`, {
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
            let res = await axios.delete(`${API_URL}/stockmutation/rejectrequest/${id}`, {
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
                                        <Th textColor={"white"}>From</Th>
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
                                        <Th textColor={"white"}>To</Th>
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

                            <FormControl mt={2}>
                                <FormLabel>Warehouse</FormLabel>
                                <Select
                                    onChange={(e) => {
                                        setWhId(e.target.value)
                                    }}
                                    placeholder={"-- Select --"}
                                >
                                    {printWarehouse()}
                                </Select>
                            </FormControl>

                            <FormControl mt={2}>
                                <FormLabel>Stock</FormLabel>
                                <Input
                                    onChange={(e) => {
                                        setStock(e.target.value);
                                    }}
                                    placeholder="Stock"
                                />
                            </FormControl>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={btnSendRequest} colorScheme="blue" mr={3}>
                            Send
                        </Button>
                        <Button >Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    );
}

export default StockManagement;