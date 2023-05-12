import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Flex,
    Heading,
    Image,
    Tab,
    TabList,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    StackDivider,
    ModalFooter,
    TabPanel,
    Select
} from '@chakra-ui/react';
import React from 'react';
import axios from "axios";
import { API_URL } from '../helper';
import { useSelector } from 'react-redux';
import Pagination from '../components/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';

function Order() {

    let token = localStorage.getItem("gadgetwarehouse_adminlogin");
    const roleId = useSelector((state) => state.adminReducer.roleId);
    const warehouseId = useSelector((state) => state.adminReducer.warehouseId);

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    let defautlPage = parseInt(params.get("page")) - 1 || 0;

    const [status, setStatus] = React.useState(0);
    const [orderList, setOrderList] = React.useState([]);
    const [orderDetails, setOrderDetails] = React.useState(null);
    const [warehouseList, setWarehouseList] = React.useState([]);
    const [warehouseListId, setWarehouseListId] = React.useState(0);
    // console.log(`warehouseListId`, warehouseListId);


    const [orderBy, setOrderBy] = React.useState("DESC");
    const [page, setPage] = React.useState(defautlPage);
    const [size] = React.useState(8);
    const [totalData, setTotalData] = React.useState(0);

    const modalDetails = useDisclosure();


    function formating(params) {
        let total = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(params);

        return total;
    };

    function dateFormat(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
            date
        );
        const day = date.getDate();
        const time = new Intl.DateTimeFormat("en-US", {
            timeStyle: "short",
            timeZone: "Asia/Jakarta",
        }).format(date);
        return `${day} ${month} ${year}, ${time} WIB`;
    };

    const getOrder = async () => {
        try {
            if (roleId === 1) {
                if (warehouseListId == 0) {
                    if (status === 0) {
                        let res = await axios.get(`${API_URL}/order/allorder?order=${orderBy}&page=${page}&size=${size}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        console.log(`getOrder`, res.data.data);
                        setOrderList(res.data.data);
                        setTotalData(res.data.datanum);
                    } else {
                        let res = await axios.get(`${API_URL}/order/allorder?status=${status}&order=${orderBy}&page=${page}&size=${size}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        console.log(`getOrder`, res.data.data);
                        setOrderList(res.data.data);
                        setTotalData(res.data.datanum);
                    }
                } else {
                    if (status === 0) {
                        let res = await axios.get(`${API_URL}/order?order=${orderBy}&page=${page}&size=${size}&warehouseId=${warehouseListId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        console.log(`getOrder`, res.data.data);
                        setOrderList(res.data.data);
                        setTotalData(res.data.datanum);
                    } else {
                        let res = await axios.get(`${API_URL}/order?status=${status}&order=${orderBy}&page=${page}&size=${size}&warehouseId=${warehouseListId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        console.log(`getOrder`, res.data.data);
                        setOrderList(res.data.data);
                        setTotalData(res.data.datanum);
                    }
                }

            } else {
                if (status === 0) {
                    let res = await axios.get(`${API_URL}/order?order=${orderBy}&page=${page}&size=${size}&warehouseId=${warehouseId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log(`getOrder`, res.data.data);
                    setOrderList(res.data.data);
                    setTotalData(res.data.datanum);
                } else {
                    let res = await axios.get(`${API_URL}/order?status=${status}&order=${orderBy}&page=${page}&size=${size}&warehouseId=${warehouseId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log(`getOrder`, res.data.data);
                    setOrderList(res.data.data);
                    setTotalData(res.data.datanum);
                }
            }

        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        getOrder();
    }, [status, orderBy])


    const printOrder = () => {
        if (orderList.length === 0) {
            return (
                <Flex
                    color={"white"}
                    maxW={"100vw"}
                    mx={"auto"}
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={7}
                >
                    <Text as={"h1"} fontWeight={"semibold"} fontSize={"3xl"}>
                        No Orders Found
                    </Text>
                </Flex>
            );
        } else {
            return orderList.map((val, idx) => {
                return <Card mb={"8px"} size="sm">
                    <CardHeader borderTopRadius={"lg"} bgColor={"#e8e8e8"}>
                        <Flex justifyContent={"space-between"}>
                            <Text>
                                {val.customer.name}
                            </Text>
                            <Text>
                                {dateFormat(val.createdAt).split(",")[0]} | {val.status.status}
                            </Text>
                        </Flex>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Flex justifyContent={"space-around"} alignItems="center">
                            <Image
                                objectFit={"contain"}
                                height={{
                                    base: "150px",
                                    md: "100px",
                                }}
                                rounded={"xl"}
                                alt="product picture"
                                src={`${API_URL}${val.orderDetails[0].type.product.productImage}`}
                            />

                            <Box>
                                <Text>{val.orderDetails[0].type.product.name}</Text>
                                <Text>{val.orderDetails[0].type.color.color} | {val.orderDetails[0].type.memory.memory}</Text>
                                <Text>{val.orderDetails[0].totalQty} Pcs</Text>
                                {val.orderDetails.length > 1 ? (
                                    <Text
                                        display={{ base: "none", md: "block" }}
                                        textAlign={"left"}
                                        color={"gray.400"}
                                        fontSize={{ md: "md" }}
                                    >
                                        +{val.orderDetails.length - 1} other products
                                    </Text>
                                ) : null}

                            </Box>
                            <Box>
                                <Text>
                                    Total Price
                                </Text>
                                <Text>
                                    {formating(val.finalPrice)}
                                </Text>
                            </Box>

                        </Flex>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <Text
                            as="u"
                            textAlign={"left"}
                            fontSize={{ base: "sm", md: "md" }}
                            color={"black"}
                            cursor={"pointer"}
                            onClick={() => {
                                getOrderDetails(val.uuid);
                            }}

                        >
                            View Details
                        </Text>
                    </CardFooter>
                </Card>
            })
        }


    };

    const getOrderDetails = async (uuid) => {
        try {
            modalDetails.onOpen()
            let res = await axios.get(`${API_URL}/order/orderdetails/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(`getOrderDetails`, res.data.data);
            setOrderDetails(res.data.data)
        } catch (error) {
            console.log(error);
        }
    };

    const printProductDetails = () => {
        return orderDetails?.orderDetails.map((val, idx) => {
            return (
                <>
                    <Box
                        w={"full"}
                        boxShadow={"dark-lg"}
                        mb={"4"}
                        rounded={"lg"}
                        mx="auto"
                    >
                        {/*===================================================================== TOP section ===========================================================================*/}
                        <Flex w={"full"} flexDirection={"column"} px="3" pt="3">
                            {/*===================================================================== MIddle section ===========================================================================*/}
                            <Flex
                                w="full"
                                borderBottom={"1px"}
                                borderBottomColor={"gray.500"}
                                mb="4"
                            >
                                <Flex
                                    h={"full"}
                                    w={{ base: "50%", md: "35%" }}
                                    justifyContent={"center"}
                                    mb="1"
                                >
                                    <Image
                                        objectFit={"contain"}
                                        height={{
                                            base: "150px",
                                            md: "200px",
                                        }}
                                        w={"full"}
                                        rounded={"xl"}
                                        alt="product picture"
                                        src={`${API_URL}${val.type.product.productImage}`}
                                    />
                                </Flex>
                                <Flex
                                    w={{ base: "50%", md: "40%" }}
                                    color={"black"}
                                    wrap={"wrap"}
                                    p={2}
                                    alignItems={"center"}
                                >
                                    <Text
                                        as="h1"
                                        textAlign={{ base: "left", md: "center" }}
                                        fontSize={{ base: "md", md: "xl" }}
                                        letterSpacing={"wider"}
                                        fontWeight={"hairline"}
                                    >
                                        {val.type.product.name}
                                    </Text>
                                    <Text
                                        as="p"
                                        w={"full"}
                                        textAlign={{ base: "left", md: "center" }}
                                        my={{ base: "2", md: "2.5", lg: "1" }}
                                        letterSpacing={"wider"}
                                        fontSize={{ base: "xs", md: "sm", lg: "md" }}
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <span
                                            style={{
                                                borderRight: "1px solid #01a35e",
                                                paddingRight: "0.5rem",
                                                marginRight: "0.5rem",
                                            }}
                                        >
                                            {val.type.color.color}
                                        </span>
                                        {val.type.memory.memory} GB
                                    </Text>
                                    <Text
                                        w={"full"}
                                        textAlign={{ base: "left", md: "left" }}
                                        fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                                        color={"gray.600"}
                                        letterSpacing={"wider"}
                                        fontWeight={"hairline"}
                                    >
                                        {val.totalQty} Pcs
                                    </Text>
                                    <Text
                                        as="p"
                                        w={"full"}
                                        textAlign={{ base: "left" }}
                                        fontSize={{ base: "sm", md: "lg", lg: "xl" }}
                                        letterSpacing={"wider"}
                                    >
                                        {formating(val.priceOnDate)}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex px={3} pb={4} alignItems={"center"} justifyContent={"center"}>
                            <Flex
                                w="full"
                                justifyContent={"space-between"}
                                alignItems={"center"}
                            >
                                <Text
                                    as={"span"}
                                    textAlign={"center"}
                                    color={"black"}
                                    letterSpacing={"wider"}
                                    fontSize={{ base: "xs", md: "md", lg: "xl" }}
                                    fontWeight={"semibold"}
                                >
                                    Total Price
                                </Text>
                                <Text
                                    as={"span"}
                                    textAlign={"center"}
                                    color={"black"}
                                    letterSpacing={"wider"}
                                    fontSize={{ base: "xs", md: "md", lg: "xl" }}
                                    fontWeight={"semibold"}
                                >
                                    {formating(val.priceOnDate * val.totalQty)}
                                </Text>
                            </Flex>
                        </Flex>
                    </Box>
                </>
            );
        })
    };

    const handleTabsChange = (index) => {
        setStatus(index);
        setPage(0);
    };

    const paginate = (pageNumber) => {
        // console.log(`pagenumber`, pageNumber.selected);
        setPage(pageNumber.selected);

        params.set("page", pageNumber.selected + 1);
        if (pageNumber.selected !== 0) {
            navigate({ search: params.toString() }); // buat update url
            // sama kaya navigate(`?${params.toString()}`);
        } else {
            params.delete("page");
            navigate({ search: params.toString() }); // buat update url
        }
    };

    const getWarehouse = async () => {
        try {
            let res = await axios.get(`${API_URL}/warehouse/allwarehouse`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("getWarehouse", res.data);
            setWarehouseList(res.data)

        } catch (error) {
            console.log(error);
        }
    };

    const printWarehouse = () => {
        return warehouseList.map((val, idx) => {
            return (
                <option value={val.id}>{val.name}</option>
            )
        })

    }

    React.useEffect(() => {
        getWarehouse()
    }, [])

    React.useEffect(() => {
        getOrder()
    }, [warehouseListId])

    return (
        <Box mt={{ md: "20px", lg: "20px", xl: "20px" }} textColor="white">
            <Flex justifyContent={"space-between"}>
                <Heading size={{ md: "md", lg: "lg" }} fontStyle="inherit">
                    Orders
                </Heading>

                {roleId == 1 ? <Select
                    color={"#e8e8e8"}
                    w={"3xs"}
                    placeholder={"All Warehouse"}
                    onChange={(e) => {
                        setWarehouseListId(e.target.value);
                        getOrder();
                    }}
                >
                    {printWarehouse()}
                </Select> : null}

            </Flex>

            <Tabs
                w={{ md: "2xl", lg: "4xl", xl: "7xl" }}
                mx="auto"
                mt={"20px"}
                isLazy
                isFitted
                variant='enclosed'
                onChange={handleTabsChange}
                size={{ md: "sm", lg: "md" }}
            >
                <TabList mb='1em'>
                    <Tab id="0">All</Tab>
                    <Tab id="9">Belum Bayar</Tab>
                    <Tab id="10">Konfirmasi Pembayaran</Tab>
                    <Tab id="11">Perlu Dikirim</Tab>
                    <Tab id="12">Dikirim</Tab>
                    <Tab id="13">Selesai</Tab>
                    <Tab id="14">Cancel</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {/* <Flex mb={"8px"} justifyContent="space-between">
                            {roleId == 1 ? <Select
                                color={"#e8e8e8"}
                                w={"3xs"}
                                placeholder={"All Warehouse"}
                                onChange={(e) => {
                                    setWarehouseListId(e.target.value);
                                    getOrder();
                                }}
                            >
                                {printWarehouse()}
                            </Select> : null}

                            <Select
                                onChange={(e) => {
                                    setOrderBy(e.target.value);
                                }}
                                w={{ base: "36%", md: "16%", lg: "13%" }}
                                float={"right"}
                                color={"#e8e8e8"}
                            >
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </Select>
                        </Flex> */}
                        <Flex mb={"8px"} justifyContent="right">
                            <Select
                                onChange={(e) => {
                                    setOrderBy(e.target.value);
                                }}
                                w={{ base: "36%", md: "16%", lg: "13%" }}
                                float={"right"}
                                color={"#e8e8e8"}
                            >
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </Select>
                        </Flex>
                        <Box>
                            {printOrder()}
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box position={"relative"} mb="20" mt="3">
                            <Select
                                // onChange={(e) => {
                                //     setOrderBy(e.target.value);
                                // }}
                                w={{ base: "36%", md: "16%", lg: "13%" }}
                                float={"right"}
                                color={"#1BF597"}
                            >
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </Select>
                        </Box>
                        {printOrder()}
                        <Flex justifyContent={"center"} w={"full"}></Flex>
                    </TabPanel>
                    <TabPanel>
                        <Box position={"relative"} mb="20" mt="3">
                            <Select
                                // onChange={(e) => {
                                //     setOrderBy(e.target.value);
                                // }}
                                w={{ base: "36%", md: "16%", lg: "13%" }}
                                float={"right"}
                                color={"#1BF597"}
                            >
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </Select>
                        </Box>
                        {printOrder()}
                        <Flex justifyContent={"center"} w={"full"}></Flex>
                    </TabPanel>
                    <TabPanel>
                        <Box position={"relative"} mb="20" mt="3">
                            <Select
                                // onChange={(e) => {
                                //     setOrderBy(e.target.value);
                                // }}
                                w={{ base: "36%", md: "16%", lg: "13%" }}
                                float={"right"}
                                color={"#1BF597"}
                            >
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </Select>
                        </Box>
                        {printOrder()}
                        <Flex justifyContent={"center"} w={"full"}></Flex>
                    </TabPanel>
                    <TabPanel>
                        <Box position={"relative"} mb="20" mt="3">
                            <Select
                                // onChange={(e) => {
                                //     setOrderBy(e.target.value);
                                // }}
                                w={{ base: "36%", md: "16%", lg: "13%" }}
                                float={"right"}
                                color={"#1BF597"}
                            >
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </Select>
                        </Box>
                        {printOrder()}
                        <Flex justifyContent={"center"} w={"full"}></Flex>
                    </TabPanel>
                    <TabPanel>
                        <Box position={"relative"} mb="20" mt="3">
                            <Select
                                // onChange={(e) => {
                                //     setOrderBy(e.target.value);
                                // }}
                                w={{ base: "36%", md: "16%", lg: "13%" }}
                                float={"right"}
                                color={"#1BF597"}
                            >
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </Select>
                        </Box>
                        {printOrder()}
                        <Flex justifyContent={"center"} w={"full"}></Flex>
                    </TabPanel>
                    <TabPanel>
                        <Box position={"relative"} mb="20" mt="3">
                            <Select
                                // onChange={(e) => {
                                //     setOrderBy(e.target.value);
                                // }}
                                w={{ base: "36%", md: "16%", lg: "13%" }}
                                float={"right"}
                                color={"#1BF597"}
                            >
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </Select>
                        </Box>
                        {printOrder()}
                        <Flex justifyContent={"center"} w={"full"}></Flex>
                    </TabPanel>
                </TabPanels>
                <Flex justifyContent={"center"}>
                    <Pagination
                        paginate={paginate}
                        size={size}
                        totalData={totalData}
                        page={page}
                    />
                </Flex>
            </Tabs>

            <Modal
                onClose={modalDetails.onClose}
                isOpen={modalDetails.isOpen}
                size={{ base: "sm", md: "xl" }}
                scrollBehavior={"inside"}
            >
                <ModalOverlay />
                <ModalContent bgColor={"white"} textColor={"black"}>
                    <ModalHeader>Order Details</ModalHeader>
                    <ModalCloseButton />
                    <Divider />
                    <ModalBody p={3}>
                        <Stack
                            spacing={3}
                            direction={"column"}
                            divider={
                                <StackDivider borderColor="gray.200" border="2px" />
                            }
                        >
                            <Box>
                                <Flex
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    fontSize={{ base: "md" }}
                                    mb="1"
                                >
                                    <Text fontWeight={"bold"}>
                                        {orderDetails?.status.status}
                                    </Text>

                                </Flex>
                                <Flex
                                    justifyContent={"space-between"}
                                    fontSize={{ base: "md" }}
                                >
                                    <Text color={"gray.500"}>Purchase Date</Text>
                                    <Text>{orderDetails ? dateFormat(orderDetails?.createdAt) : ''}</Text>
                                </Flex>
                            </Box>
                            <Box px="3">
                                <Text fontWeight={"bold"} mb="3">
                                    Product Details
                                </Text>
                                {printProductDetails()}
                            </Box>
                            <Box>
                                <Text fontWeight={"bold"} mb={3}>
                                    Payment BreakDown
                                </Text>
                                <Flex
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    fontSize={{ base: "md" }}
                                    mb="1"
                                >
                                    <Text color={"gray.500"}>Payment Method</Text>
                                    <Text
                                        fontSize={{ base: "sm" }}
                                        fontWeight={"semibold"}
                                        cursor={"pointer"}
                                    >
                                        Bank Transfer
                                    </Text>
                                </Flex>
                                <Divider my="2" />
                                <Flex
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    fontSize={{ base: "md" }}
                                    mb="1"
                                >
                                    <Text color={"gray.500"}>
                                        Subtotal ({orderDetails?.orderDetails.length} Items)
                                    </Text>
                                    <Text
                                        color={"gray.400"}
                                        fontSize={{ base: "sm" }}
                                        fontWeight={"semibold"}
                                    >
                                        {formating(
                                            orderDetails?.finalPrice / 1.1 -
                                            orderDetails?.deliveryFee
                                        )}
                                    </Text>
                                </Flex>
                                <Flex
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    fontSize={{ base: "md" }}
                                    mb="1"
                                >
                                    <Text color={"gray.500"}>Delivery Cost</Text>
                                    <Text
                                        color={"gray.400"}
                                        fontSize={{ base: "sm" }}
                                        fontWeight={"semibold"}
                                    >
                                        {formating(orderDetails?.deliveryFee)}
                                    </Text>
                                </Flex>
                                <Flex
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    fontSize={{ base: "md" }}
                                    mb="1"
                                >
                                    <Text color={"gray.500"}>Tax (10%)</Text>
                                    <Text
                                        color={"gray.400"}
                                        fontSize={{ base: "sm" }}
                                        fontWeight={"semibold"}
                                    >
                                        {formating((orderDetails?.finalPrice / 1.1) * 0.1)}
                                    </Text>
                                </Flex>
                                <Flex
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    fontSize={{ base: "md" }}
                                    mb="1"
                                    fontWeight={"bold"}
                                >
                                    <Text>Final Price</Text>
                                    <Text fontSize={{ base: "sm" }}>
                                        {formating(orderDetails?.finalPrice)}
                                    </Text>
                                </Flex>
                            </Box>
                        </Stack>
                    </ModalBody>

                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </Box >



    );
}

export default Order;