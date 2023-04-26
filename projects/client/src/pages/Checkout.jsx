import React, { useEffect, useState } from "react";
import { API_URL } from "../helper";
import axios from "axios";

import {
  Text,
  Flex,
  Spinner,
  Box,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Icon,
  Image,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { FiPlus } from "react-icons/fi";

function Checkout() {
  const navigate = useNavigate();
  const fromSession = sessionStorage.getItem("total all item");
  const token = localStorage.getItem("Gadgetwarehouse_userlogin");

  const [cartList, setCartList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressList, setAddressList] = useState([]);

  function formating(params) {
    let total = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(params);

    return total;
  }

  const getCart = async () => {
    try {
      let res = await axios.get(`${API_URL}/product/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      if (!res.data.data) {
        navigate("*");
      }
      setCartList(res.data.data);
      setPriceList(res.data.pricing);
    } catch (error) {
      console.log("error getMemory", error);
    }
  };

  const getallAddress = async () => {
    try {
      let res = await axios.get(`${API_URL}/profile/useraddress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setAddressList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const printSummary = () => {
    return cartList.map((val, idx) => {
      return (
        <>
          {/* card body */}
          <Flex w={"full"} flexDir={"column"}>
            {/*===================================================================== Left section ===========================================================================*/}
            <Flex w={"full"}>
              <Flex flexDir={"column"} p={2} w={{ base: "30%", lg: "25%" }}>
                <Flex
                  h={"full"}
                  w={"full"}
                  flexDir={"column"}
                  justifyContent={"center"}
                >
                  <Image
                    objectFit={"contain"}
                    height={{
                      base: "120px",
                      md: "170px",
                    }}
                    w={"full"}
                    rounded={"xl"}
                    alt="product picture"
                    src={`${val.product.productImage}`}
                  />
                </Flex>
              </Flex>
              {/*===================================================================== Left section ===========================================================================*/}

              {/*===================================================================== MIddle section ===========================================================================*/}

              <Flex
                color={"whiteAlpha.900"}
                wrap={"wrap"}
                p={2}
                pb={{ base: 3 }}
                w={{ base: "70%", lg: "75%" }}
                alignItems={"center"}
              >
                <Text
                  as="h1"
                  textAlign={{ base: "left", md: "center" }}
                  fontSize={{ base: "md", md: "xl" }}
                  letterSpacing={"wider"}
                  fontWeight={"hairline"}
                >
                  {val.product.name}
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
                    {val.color.color}
                  </span>
                  {val.memory.memory} GB
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

                {priceList[idx][0].discount === 0 ? (
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={2}
                    py="1"
                    textAlign={{ base: "left", md: "center" }}
                  >
                    <Text
                      as="p"
                      w={"full"}
                      textAlign={{ base: "left" }}
                      fontSize={{ base: "sm", md: "lg", lg: "xl" }}
                      letterSpacing={"wider"}
                    >
                      {formating(priceList[idx][0].price)}
                    </Text>
                  </Flex>
                ) : (
                  <Flex alignItems={"center"} gap={2} py="1" wrap={"wrap"}>
                    <Flex
                      mt={"3px"}
                      backgroundColor={"rgba(52,211,153,0.1)"}
                      rounded={"md"}
                      px={"5px"}
                    >
                      <Text
                        color={"#34D399"}
                        textAlign={"center"}
                        fontWeight={"bold"}
                        fontSize={{ base: "xs", lg: "sm" }}
                        letterSpacing={"normal"}
                      >
                        {priceList[idx][0].discount * 100}%
                      </Text>
                    </Flex>

                    <Text
                      textAlign={{ base: "left", md: "center" }}
                      fontSize={{ base: "md", md: "lg", lg: "xl" }}
                      letterSpacing={"wider"}
                    >
                      {formating(priceList[idx][0].discountedPrice)}
                    </Text>
                    <Text
                      mt={"1px"}
                      as={"s"}
                      opacity={0.3}
                      textAlign={{ base: "left", md: "center" }}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {formating(priceList[idx][0].price)}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Flex>

            {/*===================================================================== MD and above ===========================================================================*/}

            {/*===================================================================== Right section ===========================================================================*/}
            <Flex w="100%" justifyContent={"flex-end"}>
              <Divider w={{ base: "70%", lg: "74%" }} />
            </Flex>
            <Flex p={4} alignItems={"center"} justifyContent={"center"}>
              <Box w={{ base: "30%", lg: "25%" }}></Box>
              <Flex
                w={{ base: "70%", lg: "75%" }}
                justifyContent={"space-between"}
              >
                <Text
                  as={"span"}
                  textAlign={"center"}
                  color={"white"}
                  letterSpacing={"wider"}
                  fontSize={{ base: "xs", md: "md", lg: "xl" }}
                  fontWeight={"semibold"}
                >
                  Subtotal
                </Text>
                <Text
                  as={"span"}
                  textAlign={"center"}
                  color={"#1BFD9C"}
                  letterSpacing={"wider"}
                  fontSize={{ base: "xs", md: "md", lg: "xl" }}
                  fontWeight={"semibold"}
                >
                  {formating(priceList[idx][0].discountedPrice * val.totalQty)}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          {/*===================================================================== MD and above ===========================================================================*/}
        </>
      );
    });
  };

  useEffect(() => {
    getCart();
    getallAddress();
  }, []);

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
        <Flex
          my={{ base: "24", md: "36" }}
          color={"white"}
          maxW={"8xl"}
          mx={"auto"}
          flexDir={{ base: "column", md: "row" }}
          justifyContent={"space-evenly"}
          gap={"8"}
        >
          <Flex
            color={"white"}
            w={{ base: "full", md: "65%" }}
            flexDir={"column"}
            gap={"6"}
          >
            <Box w={"full"}>
              <Card color={"white"} bg={"inherit"} boxShadow={"dark-lg"}>
                <CardHeader>
                  <Heading size="md">Delivery Address</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Flex
                      justifyContent={"space-evenly"}
                      letterSpacing={"wider"}
                      alignItems={"flex-start"}
                    >
                      <Box w={"80%"}>
                        <Text fontWeight={"semibold"} mb="4">
                          customer name, Phone number
                        </Text>
                        <Text flexWrap={"wrap"} mb="4">
                          Adrress details
                        </Text>
                      </Box>
                      <Text
                        as={"button"}
                        color={"#34D399"}
                        fontWeight={"semibold"}
                      >
                        Change
                      </Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      fontWeight={"semibold"}
                      color={"#34D399"}
                      as="button"
                    >
                      <Icon boxSize={"6"} as={FiPlus} mx="2" />
                      <Text>Add New Address</Text>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            </Box>
            {/*================================================================================ ORDER SUMMARy ========================================================================================= */}
            <Box w={"full"}>
              <Card color={"white"} bg={"inherit"} boxShadow={"dark-lg"}>
                <CardHeader>
                  <Heading size="md">Order Summary</Heading>
                </CardHeader>

                <CardBody>
                  <Flex flexDir={"column"} gap={"8"}>
                    {printSummary()}
                  </Flex>
                </CardBody>
              </Card>
            </Box>
          </Flex>
          {/* =====================================================================Price DLL */}
          <Flex color={"white"} w={{ base: "full", md: "25%" }}>
            <Card
              color={"white"}
              bg={"inherit"}
              boxShadow={"dark-lg"}
              w={"full"}
            >
              <CardHeader>
                <Heading size="md">Total</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Flex justifyContent={"space-between"} mt="2">
                      <Text fontSize="md">SubTotal</Text>
                      <Text fontSize="md" fontWeight={"semibold"}>
                        {formating(sessionStorage.getItem("total all item"))}
                      </Text>
                    </Flex>

                    <Flex justifyContent={"space-between"} mt="2">
                      <Text fontSize="md">Tax (10%)</Text>
                      <Text fontSize="md" fontWeight={"semibold"}>
                        {formating(
                          sessionStorage.getItem("total all item") * 0.1
                        )}
                      </Text>
                    </Flex>
                    <Flex justifyContent={"space-between"} mt="2">
                      <Text fontSize="md">Delivery Cost</Text>
                      <Text fontSize="md" fontWeight={"semibold"}>
                        number
                      </Text>
                    </Flex>
                  </Box>
                  <Flex justifyContent={"space-between"} my="2">
                    <Text fontSize="md">Total</Text>
                    <Text
                      fontSize="md"
                      color={"#34D399"}
                      fontWeight={"semibold"}
                    >
                      {formating(
                        sessionStorage.getItem("total all item") * 0.1
                      )}
                    </Text>
                  </Flex>
                  <Box mt="2">
                    <Text fontSize="md">Choose paymnet button</Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Flex>
        </Flex>
      )}
    </>
  );
}

export default Checkout;
