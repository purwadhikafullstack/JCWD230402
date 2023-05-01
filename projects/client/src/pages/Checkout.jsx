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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  CardFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { FiPlus } from "react-icons/fi";

function Checkout() {
  const navigate = useNavigate();
  const fromSession = sessionStorage.getItem("total all item");
  const token = localStorage.getItem("Gadgetwarehouse_userlogin");

  const modalChangeAddress = useDisclosure();
  const modalAddAddress = useDisclosure();

  const [cartList, setCartList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressList, setAddressList] = useState([]);
  const [primaryAddress, setPrimaryAddress] = useState([]);
  const [user, setUser] = useState([]);
  const [value, setValue] = React.useState("");

  const [province, setProvince] = React.useState([]);
  const [provinceName, setProvinceName] = React.useState("");
  const [provinceId, setProvinceId] = React.useState();
  const [city, setCity] = React.useState([]);
  const [cityName, setCityName] = React.useState("");
  const [postalCode, setPostalCode] = React.useState();
  const [newAddress, setNewAddress] = React.useState("");
  const [city_id, setCity_id] = React.useState("");

  // console.log(`value`, value);

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

  //-------------------- get province and city --------------------

  const getProvince = async () => {
    try {
      let res = await axios.get(`${API_URL}/rajaongkir/province`);
      // console.log(`getProvince`, res.data.rajaongkir.results);
      setProvince(res.data.rajaongkir.results);
    } catch (error) {
      console.log("error getProvince", error);
    }
  };

  const printProvince = () => {
    // console.log(`province`, province);
    return province.map((val, idx) => {
      return (
        <option
          onClick={() => onClickPrintProvince(val.province)}
          value={`${val.province_id}`}
        >
          {val.province}
        </option>
      );
    });
  };

  const onClickPrintProvince = (namaprovinsi) => {
    setProvinceName(namaprovinsi);
  };

  const getCity = async () => {
    try {
      let res = await axios.get(`${API_URL}/rajaongkir/city/${provinceId}`);
      // console.log(`ini res getCity`, res.data.rajaongkir.results);

      setCity(res.data.rajaongkir.results);
    } catch (error) {
      console.log("error getCity", error);
    }
  };

  const printCity = () => {
    return city.map((val, idx) => {
      return (
        <option
          onClick={() => onClickPrintCity(val.city_name, val.postal_code)}
          // value={city_id == "" ? `${val.city_id}` : `${val.city_id = city_id}`}
          value={`${val.city_id}`}
        >
          {val.city_name}
        </option>
      );
    });
  };

  const onClickPrintCity = (namakota, kodepos) => {
    setCityName(namakota);
    setPostalCode(kodepos);
  };

  //------------------- save new address ---------------------------

  const btnSaveNewAddress = async () => {
    try {
      let res = await axios.post(
        `${API_URL}/profile/address`,
        {
          address: newAddress,
          province: provinceName,
          city: cityName,
          postalCode: postalCode,
          province_id: provinceId,
          city_id: city_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`ini dari resp btnSaveNewAddress`, res);

      if (res.data.success) {
        alert(res.data.message);
        modalAddAddress.onClose();
        getPrimaryAddress();
        getallAddress();
        setPostalCode(null);
      }
    } catch (error) {
      console.log("ini error add Location:", error);
      if (error.response.data.error) {
        alert(error.response.data.error[0].msg);
      } else {
        alert(error.response.data.message);
      }
    }
  };

  const onBtnCancelModalAdd = () => {
    modalAddAddress.onClose();
    setPostalCode(null);
  };

  //--------------------------- Change Address --------------------------------------------------

  const getallAddress = async () => {
    try {
      let res = await axios.get(`${API_URL}/profile/useraddress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`getallAddress`, res.data.data);
      setAddressList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const printAllAddress = () => {
    return addressList.map((val, idx) => {
      let temp = val.id.toString();
      return (
        <>
          <Radio value={temp}>
            {val.address}, {val.city}, {val.province}, {val.postalCode}
          </Radio>
          <Divider my={4} />
        </>
      );
    });
  };

  const getPrimaryAddress = async () => {
    try {
      let res = await axios.get(`${API_URL}/profile/useraddress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(`getPrimaryAddress`, res.data.primaryAddress[0]);
      setPrimaryAddress(res.data.primaryAddress[0]);
      setValue(res.data.primaryAddress[0].id.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const getUserAddress = async () => {
    try {
      let res = await axios.get(`${API_URL}/profile/useraddress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(`getUserAddress`, res.data.user);
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const btnConfirmAddress = async () => {
    try {
      let res = await axios.patch(
        `${API_URL}/profile/primaryaddress`,
        {
          id: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("btnConfirmAddress", res);

      if (res.data.status) {
        alert(res.data.message);
        modalChangeAddress.onClose();
        getPrimaryAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //-----------------------------------------------------------------------------------------------

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
    getPrimaryAddress();
    getUserAddress();
  }, []);

  useEffect(() => {
    getProvince();
    getCity();
  }, [provinceId]);

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
          gap={{ base: "8", md: "3", lg: "8" }}
        >
          <Flex
            color={"white"}
            w={{ base: "full", md: "60%", lg: "65%" }}
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
                          {`${user.name}, ${user.phone}`}
                        </Text>
                        {addressList.length == 0 ? (
                          <Text>
                            No address detected, please add a new address.
                          </Text>
                        ) : (
                          <Text flexWrap={"wrap"} mb="4">
                            {`${primaryAddress?.address}, ${primaryAddress?.city}, ${primaryAddress?.province}, ${primaryAddress?.postalCode}`}
                          </Text>
                        )}
                      </Box>
                      <Text
                        as={"button"}
                        color={"#34D399"}
                        fontWeight={"semibold"}
                        onClick={modalChangeAddress.onOpen}
                      >
                        Change
                      </Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      fontWeight={"semibold"}
                      color={"#34D399"}
                      as="button"
                      onClick={modalAddAddress.onOpen}
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
          <Flex
            color={"white"}
            w={{ base: "full", md: "30%", lg: "25%" }}
            flexWrap={"wrap"}
            boxShadow={"dark-lg"}
          >
            <Card color={"white"} bg={"inherit"} w={"full"}>
              <CardHeader>
                <Heading size="lg">Total</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Flex justifyContent={"space-between"} mt="2">
                      <Text fontSize={{ base: "md", md: "sm", lg: "md" }}>
                        SubTotal
                      </Text>
                      <Text
                        fontSize={{ base: "md", md: "sm", lg: "md" }}
                        fontWeight={"semibold"}
                      >
                        {formating(sessionStorage.getItem("total all item"))}
                      </Text>
                    </Flex>

                    <Flex justifyContent={"space-between"} mt="2">
                      <Text fontSize={{ base: "md", md: "sm", lg: "md" }}>
                        Tax (10%)
                      </Text>
                      <Text
                        fontSize={{ base: "md", md: "sm", lg: "md" }}
                        fontWeight={"semibold"}
                      >
                        {formating(
                          sessionStorage.getItem("total all item") * 0.1
                        )}
                      </Text>
                    </Flex>
                    <Flex justifyContent={"space-between"} mt="2">
                      <Text fontSize={{ base: "md", md: "sm", lg: "md" }}>
                        Delivery Cost
                      </Text>
                      {addressList.length === 0 ? (
                        <Text
                          fontSize={{ base: "md", md: "sm", lg: "md" }}
                          fontWeight={"semibold"}
                        >
                          -
                        </Text>
                      ) : (
                        <Text
                          fontSize={{ base: "md", md: "sm", lg: "md" }}
                          fontWeight={"semibold"}
                        >
                          number
                        </Text>
                      )}
                    </Flex>
                  </Box>
                  <Flex justifyContent={"space-between"} my="2">
                    <Text fontSize={{ base: "md", md: "sm", lg: "md" }}>
                      Total
                    </Text>
                    {addressList.length === 0 ? (
                      <Text
                        fontSize={{ base: "md", md: "sm", lg: "md" }}
                        color={"#34D399"}
                        fontWeight={"semibold"}
                      >
                        -
                      </Text>
                    ) : (
                      <Text
                        fontSize={{ base: "md", md: "sm", lg: "md" }}
                        color={"#34D399"}
                        fontWeight={"semibold"}
                      >
                        {formating(
                          sessionStorage.getItem("total all item") * 0.1
                        )}
                      </Text>
                    )}
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
            {addressList.length === 0 ? null : (
              <>
                <Card color={"white"} bg={"inherit"} w={"full"}>
                  <CardBody>
                    <Heading fontSize={{ base: "lg", lg: "md" }} mb="5">
                      Shipping Method
                    </Heading>
                    <Stack spacing="4">
                      <RadioGroup>
                        <Radio
                          w="full"
                          size={"sm"}
                          alignItems={"center"}
                          mx={"auto"}
                        >
                          <Flex
                            flexWrap={"wrap"}
                            justifyContent={"space-between"}
                            w={{
                              base: "351px",
                              md: "159px",
                              lg: "190px",
                              xl: "300px",
                            }}
                            fontSize={{ base: "sm", lg: "sm" }}
                          >
                            <Text textTransform="uppercase">
                              sicepat - siunit
                            </Text>
                            <Text mt={1}>{formating(12000)}</Text>
                          </Flex>
                          <Text fontSize="xs" opacity={"0.4"}>
                            SICEPAT - SiUntung 1-2 days
                          </Text>
                        </Radio>
                        <Divider my={4} />
                        <Radio w="full" size={"sm"} alignItems={"center"}>
                          <Flex
                            flexWrap={"wrap"}
                            justifyContent={"space-between"}
                            w={{
                              base: "351px",
                              md: "159px",
                              lg: "190px",
                              xl: "300px",
                            }}
                            fontSize={{ base: "sm", lg: "sm" }}
                          >
                            <Text textTransform="uppercase">sicepat - REG</Text>
                            <Text mt={1}>{formating(15000)}</Text>
                          </Flex>
                          <Text fontSize="xs" opacity={"0.4"}>
                            SICEPAT - Layanan Reguler 1-2 days
                          </Text>
                        </Radio>
                        <Divider my={4} />
                      </RadioGroup>
                    </Stack>
                  </CardBody>
                  <CardFooter justifyContent={"center"}>
                    <Button
                      variant={"solid"}
                      backgroundColor={"#019d5a"}
                      color={"black"}
                      _hover={{
                        color: "white",
                        scale: "105",
                        bgColor: "#34D399",
                      }}
                      mt="4"
                    >
                      Continue with Payment
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </Flex>
        </Flex>
      )}

      {/* --------------- modal change address ----------------- */}

      <Modal
        isOpen={modalChangeAddress.isOpen}
        onClose={modalChangeAddress.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>My Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup defaultValue={value} onChange={setValue} value={value}>
              <Stack>{printAllAddress()}</Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Close
            </Button>
            <Button onClick={btnConfirmAddress}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ------------- modal add new address -------------------- */}
      <Modal isOpen={modalAddAddress.isOpen} onClose={modalAddAddress.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <FormControl>
                <FormLabel>Province</FormLabel>
                <Select
                  onChange={(e) => {
                    setProvinceId(e.target.value);
                    // setProvinceName(e.target.value.split(",")[1]);
                  }}
                  placeholder={"-- Select --"}
                >
                  {printProvince()}
                </Select>
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>City</FormLabel>
                <Select
                  onChange={(e) => {
                    setCity_id(e.target.value);
                  }}
                  placeholder={"-- Select --"}
                >
                  {printCity()}
                </Select>
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Address</FormLabel>
                <Textarea
                  onChange={(e) => {
                    setNewAddress(e.target.value);
                  }}
                  placeholder="Address"
                  maxLength={300}
                  resize={"none"}
                />
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Postal Code</FormLabel>
                <Input
                  isDisabled={true}
                  placeholder={postalCode}
                  _placeholder={{ opacity: 1, color: "black" }}
                />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={btnSaveNewAddress} colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onBtnCancelModalAdd}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Checkout;
