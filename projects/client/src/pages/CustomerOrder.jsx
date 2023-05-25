import React, { useEffect, useState } from "react";
import { API_URL, API_IMG_URL } from "../helper";
import axios from "axios";

import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Text,
  Flex,
  Spinner,
  Box,
  Heading,
  Image,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  FormControl,
  Select,
  TabIndicator,
  Stack,
  StackDivider,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import uploadImg from "../img/1156518-200.png";

function CustomerOrder() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  let defautlPage = parseInt(params.get("page")) - 1 || 0;

  const modalDetails = useDisclosure();
  const modalPayment = useDisclosure();
  const token = localStorage.getItem("Gadgetwarehouse_userlogin");
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(true);
  const [status, setStatus] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [orderBy, setOrderBy] = useState("DESC");
  const [oneOrderList, setOneOrderList] = useState(null);
  const [page, setPage] = useState(defautlPage);
  const [size] = useState(8); // to change how many items per page
  const [totalData, setTotalData] = useState(0);
  const inputFile = React.useRef(null);
  const [fileProduct, setFileProduct] = useState(null);
  const [order, setOrder] = useState("");


  function shorten(params) {
    return params.toUpperCase().split("-")[params.split("-").length - 1];
  }

  function formating(params) {
    let total = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(params);

    return total;
  }

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
  }

  const getOrders = async () => {
    try {
      if (status === 0) {
        const res = await axios.get(
          `${API_URL}/order/customer-order?order=${orderBy}&page=${page}&size=${size}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLoading(false);
        setOrderList(res.data.data);
        setTotalData(res.data.datanum);
      } else {
        const res = await axios.get(
          `${API_URL}/order/customer-order?status=${status}&order=${orderBy}&page=${page}&size=${size}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLoading(false);
        setOrderList(res.data.data);
        setTotalData(res.data.datanum);
      }
    } catch (error) {
      console.log("error getOrders", error);
    }
  };

  const printOrders = () => {
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
        return (
          <>
            <Box w={"full"} boxShadow={"dark-lg"} mb={"6"} rounded={"lg"}>
              {/*===================================================================== TOP section ===========================================================================*/}
              <Flex w={"full"} flexDirection={"column"} px="3" pt="3">
                <Flex gap="3" alignItems={"center"} mb="4">
                  <Text fontSize={{ base: "xs", lg: "xs" }}>
                    {dateFormat(val.createdAt).split(",")[0]}
                  </Text>
                  <Flex
                    backgroundColor={
                      val.status === 13
                        ? "rgba(52,211,153,0.1)"
                        : val.status === 14
                        ? "rgba(255,0,0,0.3)"
                        : "rgba(240,220,91,0.5)"
                    }
                    rounded={"md"}
                    px={"5px"}
                  >
                    <Text
                      color={val.status === 13 ? "#34D399" : "black"}
                      textAlign={"center"}
                      fontWeight={"semibold"}
                      fontSize={{ base: "xs", lg: "xs" }}
                      letterSpacing={"normal"}
                      mb="1px"
                    >
                      {val.status.status}
                    </Text>
                  </Flex>
                  <Text
                    display={{ base: "none", md: "block" }}
                    color={"gray.400"}
                    textAlign={"center"}
                    fontWeight={"semibold"}
                    fontSize={{ base: "xs", lg: "sm" }}
                    letterSpacing={"wider"}
                    mb="1px"
                  >
                    {shorten(val.uuid)}
                  </Text>
                </Flex>
                {/*===================================================================== MIddle section ===========================================================================*/}
                <Flex
                  w="full"
                  borderTop={"1px"}
                  borderTopColor={"gray.500"}
                  borderBottom={"1px"}
                  borderBottomColor={"gray.500"}
                  mb="4"
                >
                  <Flex
                    h={"full"}
                    w={{ base: "50%", md: "35%" }}
                    justifyContent={"center"}
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
                      src={`${API_IMG_URL}${val.orderdetails[0].type.product.productImage}`}
                    />
                  </Flex>
                  <Flex
                    w={{ base: "50%", md: "40%" }}
                    color={"whiteAlpha.900"}
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
                      {val.orderdetails[0].type.product.name}
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
                        {val.orderdetails[0].type.color.color}
                      </span>
                      {val.orderdetails[0].type.memory.memory} GB
                    </Text>
                    <Text
                      w={"full"}
                      textAlign={{ base: "left", md: "left" }}
                      fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                      color={"gray.300"}
                      letterSpacing={"wider"}
                      fontWeight={"hairline"}
                    >
                      {val.orderdetails[0].totalQty} Pcs
                    </Text>
                    <Text
                      as="p"
                      w={"full"}
                      textAlign={{ base: "left" }}
                      fontSize={{ base: "sm", md: "lg", lg: "xl" }}
                      letterSpacing={"wider"}
                    >
                      {formating(val.orderdetails[0].priceOnDate)}
                    </Text>

                    {val.orderdetails.length > 1 ? (
                      <Text
                        display={{ base: "none", md: "block" }}
                        textAlign={"left"}
                        color={"gray.400"}
                        fontSize={{ md: "md" }}
                      >
                        +{val.orderdetails.length - 1} other products
                      </Text>
                    ) : null}
                  </Flex>
                  <Flex
                    flexDir={"column"}
                    display={{ base: "none", md: "flex" }}
                    w={{ md: "25%" }}
                    justifyContent={"space-evenly"}
                  >
                    <Text
                      as={"span"}
                      textAlign={"center"}
                      color={"white"}
                      letterSpacing={"wider"}
                      fontSize={{ base: "xs", md: "md", lg: "xl" }}
                      fontWeight={"semibold"}
                    >
                      Total Price
                    </Text>
                    <Text
                      as={"span"}
                      textAlign={"center"}
                      color={"#1BFD9C"}
                      letterSpacing={"wider"}
                      fontSize={{ base: "xs", md: "md", lg: "xl" }}
                      fontWeight={"semibold"}
                    >
                      {formating(val.finalPrice)}
                    </Text>
                  </Flex>
                </Flex>
                {val.orderdetails.length > 1 ? (
                  <Flex
                    justifyContent={"space-between"}
                    display={{ base: "flex", md: "none" }}
                  >
                    <Text
                      display={{ md: "none" }}
                      mb="4"
                      textAlign={"left"}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      +{val.orderdetails.length - 1} other products
                    </Text>
                    <Text
                      display={{ md: "none" }}
                      as="u"
                      mb="4"
                      textAlign={"left"}
                      fontSize={{ base: "sm", md: "md" }}
                      color={"#1AC17A"}
                      cursor={"pointer"}
                      onClick={() => {
                        getOneOrder(val.uuid);
                      }}
                    >
                      View Details
                    </Text>
                  </Flex>
                ) : (
                  <Flex
                    justifyContent={"space-between"}
                    display={{ base: "flex", md: "none" }}
                  >
                    <Text
                      color={"#17171A"}
                      mb="4"
                      textAlign={"left"}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      -
                    </Text>
                    <Text
                      display={{ md: "none" }}
                      as="u"
                      mb="4"
                      textAlign={"left"}
                      fontSize={{ base: "sm", md: "md" }}
                      color={"#1AC17A"}
                      cursor={"pointer"}
                      onClick={() => {
                        getOneOrder(val.uuid);
                      }}
                    >
                      View Details
                    </Text>
                  </Flex>
                )}
              </Flex>

              {/*===================================================================== Bottom section ===========================================================================*/}

              {/*===================================================================== below MD ===========================================================================*/}
              <Flex
                px={3}
                pb={4}
                alignItems={"center"}
                justifyContent={"center"}
                display={{ md: "none" }}
              >
                <Flex
                  w="full"
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Flex flexDir={"column"}>
                    <Text
                      as={"span"}
                      textAlign={"center"}
                      color={"white"}
                      letterSpacing={"wider"}
                      fontSize={{ base: "xs", md: "md", lg: "xl" }}
                      fontWeight={"semibold"}
                    >
                      Total Price
                    </Text>
                    <Text
                      as={"span"}
                      textAlign={"center"}
                      color={"#1BFD9C"}
                      letterSpacing={"wider"}
                      fontSize={{ base: "xs", md: "md", lg: "xl" }}
                      fontWeight={"semibold"}
                    >
                      {formating(val.finalPrice)}
                    </Text>
                  </Flex>
                  {val.statusId === 9 ? (
                    <Button
                      onClick={() => {
                        modalPayment.onOpen();
                        setOrder(val.uuid);
                      }}
                      letterSpacing={"normal"}
                      size={"sm"}
                      variant={"solid"}
                      backgroundColor={"#019d5a"}
                      color={"black"}
                      _hover={{
                        scale: "105",
                        bgColor: "#34D399",
                      }}
                    >
                      Confirm Payment
                    </Button>
                  ) : null}
                </Flex>
              </Flex>
              {/*===================================================================== below MD ===========================================================================*/}

              <Box
                p={4}
                alignItems={"center"}
                justifyContent={"center"}
                display={{ base: "none", md: "flex" }}
              >
                <Flex w={"90%"} justifyContent={"space-between"}>
                  <Text
                    as="u"
                    mb="4"
                    fontSize={{ md: "md", lg: "xl" }}
                    color={"#1AC17A"}
                    cursor={"pointer"}
                    onClick={() => {
                      getOneOrder(val.uuid);
                    }}
                  >
                    View Details
                  </Text>
                  {val.statusId === 9 ? (
                    <Button
                      onClick={() => {
                        modalPayment.onOpen();
                        setOrder(val.uuid);
                      }}
                      letterSpacing={"normal"}
                      size={"sm"}
                      variant={"solid"}
                      backgroundColor={"#019d5a"}
                      color={"black"}
                      _hover={{
                        color: "white",
                        scale: "105",
                        bgColor: "#34D399",
                      }}
                    >
                      Confirm Payment
                    </Button>
                  ) : null}
                </Flex>
              </Box>
            </Box>
          </>
        );
      });
    }
  };

  const getOneOrder = async (params) => {
    try {
      modalDetails.onOpen();
      const res = await axios.get(`${API_URL}/order/one-order?uuid=${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalLoading(false);
      setOneOrderList(res.data.data);
    } catch (error) {
      console.log("error getOrders", error);
    }
  };

  const handleTabsChange = (index) => {
    setStatus(index);
    setPage(0);
  };

  const printModalBody = () => {
    return oneOrderList.orderdetails.map((val, idx) => {
      return (
        <>
          <Box
            w={"full"}
            boxShadow={"dark-lg"}
            mb={"6"}
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
                    src={`${API_IMG_URL}${val.type.product.productImage}`}
                  />
                </Flex>
                <Flex
                  w={{ base: "50%", md: "40%" }}
                  color={"whiteAlpha.900"}
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
                    color={"gray.300"}
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

            {/*===================================================================== Bottom section ===========================================================================*/}

            <Flex px={3} pb={4} alignItems={"center"} justifyContent={"center"}>
              <Flex
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  as={"span"}
                  textAlign={"center"}
                  color={"white"}
                  letterSpacing={"wider"}
                  fontSize={{ base: "xs", md: "md", lg: "xl" }}
                  fontWeight={"semibold"}
                >
                  Total Price
                </Text>
                <Text
                  as={"span"}
                  textAlign={"center"}
                  color={"#1BFD9C"}
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
    });
  };

  const paginate = (pageNumber) => {
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

  const onChangeFile = (event) => {
    setFileProduct(event.target.files[0]);
  };

  const btnConfirmPayment = async () => {
    try {
      if (fileProduct != null) {
        let formData = new FormData();

        formData.append(
          "data",
          JSON.stringify({
            order: order,
          })
        );

        formData.append("images", fileProduct);

        const res = await axios.patch(`${API_URL}/order/payment`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          getOrders();
          setOrder("");
          setFileProduct(null);
          modalPayment.onClose();
        }
      } else {
        toast({
          title: "Failed to Upload Image",
          description: `PLease Ensure that an image is chosen`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, [status, orderBy]);

  return (
    <>
      {loading == true ? (
        <Flex
          justifyContent={"center"}
          my={{ base: "60", md: "80" }}
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
        <Box
          my={{ base: "24", md: "36" }}
          color={"white"}
          maxW={"6xl"}
          mx={"auto"}
          rounded={"lg"}
          boxShadow={"dark-lg"}
          px={{ base: "4", lg: "8" }}
        >
          <Heading mb="6">Your Orders</Heading>

          <Tabs
            index={status}
            onChange={handleTabsChange}
            isFitted={true}
            align="center"
            isLazy
            variant={"unstyled"}
          >
            <TabList mr="3" overflowX={"scroll"}>
              <Tab>All</Tab>
              <Tab>Awaiting Payment</Tab>
              <Tab>Waiting for Confirmation</Tab>
              <Tab>Processing</Tab>
              <Tab>Sent</Tab>
              <Tab>Received</Tab>
              <Tab>Cancelled</Tab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="#1BFD9C"
              borderRadius="1px"
            />
            <Divider />
            <TabPanels>
              {/* initially mounted */}
              <TabPanel>
                <Box position={"relative"} mb="20" mt="3">
                  <Select
                    onChange={(e) => {
                      setOrderBy(e.target.value);
                    }}
                    w={{ base: "36%", md: "16%", lg: "13%" }}
                    float={"right"}
                    color={"#1BF597"}
                  >
                    <option style={{ backgroundColor: "#18181B" }} value="DESC">
                      Newest
                    </option>
                    <option style={{ backgroundColor: "#18181B" }} value="ASC">
                      Oldest
                    </option>
                  </Select>
                </Box>
                {printOrders()}
                <Flex
                  justifyContent={"center"}
                  w={"full"}
                  display={orderList.length === 0 ? "none" : "flex"}
                >
                  <Pagination
                    paginate={paginate}
                    size={size}
                    totalData={totalData}
                    page={page}
                  />
                </Flex>
              </TabPanel>
              {/* initially not mounted */}
              <TabPanel>
                <Box position={"relative"} mb="20" mt="3">
                  <Select
                    w={{ base: "36%", md: "16%", lg: "13%" }}
                    float={"right"}
                    color={"#1BF597"}
                  >
                    <option style={{ backgroundColor: "#18181B" }} value="DESC">
                      Newest
                    </option>
                    <option style={{ backgroundColor: "#18181B" }} value="ASC">
                      Oldest
                    </option>
                  </Select>
                </Box>
                {printOrders()}
                <Flex
                  justifyContent={"center"}
                  w={"full"}
                  display={orderList.length === 0 ? "none" : "flex"}
                >
                  <Pagination
                    paginate={paginate}
                    size={size}
                    totalData={totalData}
                    page={page}
                  />
                </Flex>
              </TabPanel>
              <TabPanel>
                <Box position={"relative"} mb="20" mt="3">
                  <Select
                    w={{ base: "36%", md: "16%", lg: "13%" }}
                    float={"right"}
                    color={"#1BF597"}
                  >
                    <option style={{ backgroundColor: "#18181B" }} value="DESC">
                      Newest
                    </option>
                    <option style={{ backgroundColor: "#18181B" }} value="ASC">
                      Oldest
                    </option>
                  </Select>
                </Box>
                {printOrders()}
                <Flex
                  justifyContent={"center"}
                  w={"full"}
                  display={orderList.length === 0 ? "none" : "flex"}
                >
                  <Pagination
                    paginate={paginate}
                    size={size}
                    totalData={totalData}
                    page={page}
                  />
                </Flex>
              </TabPanel>
              <TabPanel>
                <Box position={"relative"} mb="20" mt="3">
                  <Select
                    w={{ base: "36%", md: "16%", lg: "13%" }}
                    float={"right"}
                    color={"#1BF597"}
                  >
                    <option style={{ backgroundColor: "#18181B" }} value="DESC">
                      Newest
                    </option>
                    <option style={{ backgroundColor: "#18181B" }} value="ASC">
                      Oldest
                    </option>
                  </Select>
                </Box>
                {printOrders()}
                <Flex
                  justifyContent={"center"}
                  w={"full"}
                  display={orderList.length === 0 ? "none" : "flex"}
                >
                  <Pagination
                    paginate={paginate}
                    size={size}
                    totalData={totalData}
                    page={page}
                  />
                </Flex>
              </TabPanel>
              <TabPanel>
                <Box position={"relative"} mb="20" mt="3">
                  <Select
                    w={{ base: "36%", md: "16%", lg: "13%" }}
                    float={"right"}
                    color={"#1BF597"}
                  >
                    <option style={{ backgroundColor: "#18181B" }} value="DESC">
                      Newest
                    </option>
                    <option style={{ backgroundColor: "#18181B" }} value="ASC">
                      Oldest
                    </option>
                  </Select>
                </Box>
                {printOrders()}
                <Flex
                  justifyContent={"center"}
                  w={"full"}
                  display={orderList.length === 0 ? "none" : "flex"}
                >
                  <Pagination
                    paginate={paginate}
                    size={size}
                    totalData={totalData}
                    page={page}
                  />
                </Flex>
              </TabPanel>
              <TabPanel>
                <Box position={"relative"} mb="20" mt="3">
                  <Select
                    w={{ base: "36%", md: "16%", lg: "13%" }}
                    float={"right"}
                    color={"#1BF597"}
                  >
                    <option style={{ backgroundColor: "#18181B" }} value="DESC">
                      Newest
                    </option>
                    <option style={{ backgroundColor: "#18181B" }} value="ASC">
                      Oldest
                    </option>
                  </Select>
                </Box>
                {printOrders()}
                <Flex
                  justifyContent={"center"}
                  w={"full"}
                  display={orderList.length === 0 ? "none" : "flex"}
                >
                  <Pagination
                    paginate={paginate}
                    size={size}
                    totalData={totalData}
                    page={page}
                  />
                </Flex>
              </TabPanel>

              <TabPanel>
                <Box position={"relative"} mb="20" mt="3">
                  <Select
                    w={{ base: "36%", md: "16%", lg: "13%" }}
                    float={"right"}
                    color={"#1BF597"}
                  >
                    <option style={{ backgroundColor: "#18181B" }} value="DESC">
                      Newest
                    </option>
                    <option style={{ backgroundColor: "#18181B" }} value="ASC">
                      Oldest
                    </option>
                  </Select>
                </Box>
                {printOrders()}
                <Flex
                  justifyContent={"center"}
                  w={"full"}
                  display={orderList.length === 0 ? "none" : "flex"}
                >
                  <Pagination
                    paginate={paginate}
                    size={size}
                    totalData={totalData}
                    page={page}
                  />
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Modal
            onClose={modalDetails.onClose}
            isOpen={modalDetails.isOpen}
            size={{ base: "sm", md: "xl" }}
            scrollBehavior={"inside"}
          >
            <ModalOverlay />
            <ModalContent bgColor={"#18181B"} textColor={"white"}>
              <ModalHeader>Order Details</ModalHeader>
              <ModalCloseButton />
              <Divider />
              {modalLoading === true ? (
                <ModalBody p={3}>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                </ModalBody>
              ) : (
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
                          {oneOrderList.status.status}
                        </Text>
                        <Text
                          fontSize={{ base: "sm" }}
                          fontWeight={"semibold"}
                          color={"#34D399"}
                          cursor={"pointer"}
                        >
                          View Details
                        </Text>
                      </Flex>
                      <Flex
                        justifyContent={"space-between"}
                        fontSize={{ base: "md" }}
                        mb={1}
                      >
                        <Text color={"gray.500"}>Purchase Date</Text>
                        <Text>{dateFormat(oneOrderList.createdAt)}</Text>
                      </Flex>
                      <Flex
                        justifyContent={"space-between"}
                        fontSize={{ base: "md" }}
                      >
                        <Text color={"gray.500"}>Order No.</Text>
                        <Text>{shorten(oneOrderList.uuid)}</Text>
                      </Flex>
                    </Box>
                    <Box px="3">
                      <Text fontWeight={"bold"} mb="3">
                        Product Details
                      </Text>
                      {printModalBody()}
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
                          Subtotal ({oneOrderList.orderdetails.length} Items)
                        </Text>
                        <Text
                          color={"gray.400"}
                          fontSize={{ base: "sm" }}
                          fontWeight={"semibold"}
                        >
                          {formating(
                            oneOrderList?.finalPrice / 1.1 -
                              oneOrderList?.deliveryFee
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
                          {formating(oneOrderList?.deliveryFee)}
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
                          {formating((oneOrderList?.finalPrice / 1.1) * 0.1)}
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
                          {formating(oneOrderList?.finalPrice)}
                        </Text>
                      </Flex>
                    </Box>
                  </Stack>
                </ModalBody>
              )}

              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
          <Modal
            onClose={modalPayment.onClose}
            isOpen={modalPayment.isOpen}
            size={{ base: "sm", md: "xl" }}
            isCentered
          >
            <ModalOverlay />
            <ModalContent bgColor={"#18181B"} textColor={"white"}>
              <ModalHeader>Upload Payment</ModalHeader>
              <ModalCloseButton
                onClick={() => {
                  setFileProduct(null);
                  modalPayment.onClose();
                }}
              />
              <ModalBody>
                <FormControl>
                  <Image
                    alt="product picture"
                    src={
                      !fileProduct
                        ? uploadImg
                        : URL.createObjectURL(fileProduct)
                    }
                    style={{
                      width: "75px",
                      height: "75px",
                      aspectRatio: "1/1",
                      objectFit: "contain",
                    }}
                  />
                  <input
                    type="file"
                    id="file"
                    style={{ display: "block" }}
                    ref={inputFile}
                    onChange={onChangeFile}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                {fileProduct != null ? (
                  <Button
                    onClick={btnConfirmPayment}
                    letterSpacing={"normal"}
                    size={"md"}
                    variant={"solid"}
                    backgroundColor={"#019d5a"}
                    color={"black"}
                    _hover={{
                      scale: "105",
                      bgColor: "#34D399",
                    }}
                  >
                    Confirm
                  </Button>
                ) : (
                  <Button
                    isDisabled={true}
                    onClick={btnConfirmPayment}
                    letterSpacing={"normal"}
                    size={"md"}
                    variant={"solid"}
                    backgroundColor={"#019d5a"}
                    color={"black"}
                    _hover={{
                      scale: "105",
                      bgColor: "#34D399",
                    }}
                  >
                    Confirm
                  </Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </>
  );
}

export default CustomerOrder;
