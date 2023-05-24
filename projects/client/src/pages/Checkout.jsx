import React, { useEffect, useState } from "react";
import { API_URL, API_IMG_URL } from "../helper";
import axios from "axios";
import { cartAction } from "../reducers/cart";
import { useDispatch } from "react-redux";

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
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { FiPlus } from "react-icons/fi";

function Checkout() {
  const toast = useToast();
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
  const [ongkirList, setOngkirList] = React.useState([]);
  const [ongkirValue, setOngkirValue] = React.useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const dispatch = useDispatch();

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
      dispatch(cartAction(res.data.datanum));
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

      setProvince(res.data.rajaongkir.results);
    } catch (error) {
      console.log("error getProvince", error);
    }
  };

  const printProvince = () => {
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

      if (res.data.success) {
        // alert(res.data.message);
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true
        })
        modalAddAddress.onClose();
        getPrimaryAddress();
        getallAddress();
        setPostalCode(null);
      }
    } catch (error) {
      console.log("ini error add Location:", error);
      if (error.response.data.error) {
        // alert(error.response.data.error[0].msg);
        toast({
          title: `${error.response.data.error[0].msg}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // alert(error.response.data.message);
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
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
      let res = await axios.get(`${API_URL}/profile/user-address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      let res = await axios.get(`${API_URL}/profile/user-address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPrimaryAddress(res.data.primaryAddress[0]);
      setValue(res.data.primaryAddress[0].id.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const getUserAddress = async () => {
    try {
      let res = await axios.get(`${API_URL}/profile/user-address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const btnConfirmAddress = async () => {
    try {
      let res = await axios.patch(
        `${API_URL}/profile/primary-address`,
        {
          id: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status) {
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        modalChangeAddress.onClose();
        getPrimaryAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const distance = async () => {
    try {
      let distance = await axios.post(
        `${API_URL}/checkout/`,
        {
          customerAddress: primaryAddress.location,
          city_id: primaryAddress.city_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOngkirList(distance.data.data[0].costs);
      setSelectedWarehouse(distance.data.warehouse);
    } catch (error) {
      console.log(error);
    }
  };

  const printOngkir = () => {
    return ongkirList.map((val, idx) => {
      let temp = idx.toString();
      return (
        <>
          <Radio
            w="full"
            size={"sm"}
            alignItems={"center"}
            mx={"auto"}
            value={temp}
          >
            <Flex
              flexWrap={"wrap"}
              justifyContent={"space-between"}
              w={{
                base: "300px",
                md: "159px",
                lg: "190px",
                xl: "300px",
              }}
              fontSize={{ base: "sm", lg: "sm" }}
            >
              <Text textTransform="uppercase">{`JNE - ${val.service}`}</Text>
              <Text mt={1}>{formating(val.cost[0].value)}</Text>
            </Flex>
            <Text fontSize="xs" opacity={"0.4"}>
              {`${val.description} - ${val.cost[0].etd} days`}
            </Text>
          </Radio>
          <Divider my={4} />
        </>
      );
    });
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
                    src={`${API_IMG_URL}${val.product.productImage}`}
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

  const onBtnConfirmCheckout = async () => {
    try {
      let res = await axios.post(
        `${API_URL}/order/`,
        {
          deliveryFee: ongkirList[ongkirValue].cost[0].value,
          finalPrice:
            parseInt(sessionStorage.getItem("total all item")) +
            ongkirList[ongkirValue].cost[0].value +
            (parseInt(sessionStorage.getItem("total all item")) +
              ongkirList[ongkirValue].cost[0].value) *
            0.1,
          warehousechoice: selectedWarehouse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        getCart();
        navigate("/MyOrder");
      }
    } catch (error) {
      if (error.response.message) {
        toast({
          title: "Failed to Place Order",
          description: `${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
      console.log("error confirm checkout", error);
    }
  };

  useEffect(() => {
    distance();
  }, [primaryAddress]);

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
          <Box
            color={"white"}
            w={{ base: "full", md: "30%", lg: "25%" }}
            boxShadow={"dark-lg"}
            h={`fit-content`}
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
                          {ongkirValue == ""
                            ? "-"
                            : formating(ongkirList[ongkirValue].cost[0].value)}
                        </Text>
                      )}
                    </Flex>

                    <Flex justifyContent={"space-between"} mt="2">
                      <Text fontSize={{ base: "md", md: "sm", lg: "md" }}>
                        Tax (10%)
                      </Text>
                      <Text
                        fontSize={{ base: "md", md: "sm", lg: "md" }}
                        fontWeight={"semibold"}
                      >
                        {ongkirValue == ""
                          ? "-"
                          : formating(
                            (parseInt(
                              sessionStorage.getItem("total all item")
                            ) +
                              ongkirList[ongkirValue].cost[0].value) *
                            0.1
                          )}
                      </Text>
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
                        {ongkirValue == ""
                          ? "-"
                          : formating(
                            parseInt(
                              sessionStorage.getItem("total all item")
                            ) +
                            ongkirList[ongkirValue].cost[0].value +
                            (parseInt(
                              sessionStorage.getItem("total all item")
                            ) +
                              ongkirList[ongkirValue].cost[0].value) *
                            0.1
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
                      <RadioGroup onChange={setOngkirValue} value={ongkirValue}>
                        {printOngkir()}
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
                      onClick={onBtnConfirmCheckout}
                    >
                      Continue with Payment
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </Box>
        </Flex>
      )}

      {/* --------------- modal change address ----------------- */}

      <Modal
        isOpen={modalChangeAddress.isOpen}
        onClose={modalChangeAddress.onClose}
        size={{ base: "xs", md: "md" }}
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
            <Button colorScheme="blue" mr={3} onClick={btnConfirmAddress}>
              Confirm
            </Button>
            <Button onClick={modalChangeAddress.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ------------- modal add new address -------------------- */}
      <Modal
        isOpen={modalAddAddress.isOpen}
        onClose={modalAddAddress.onClose}
        size={{ base: "xs", md: "md" }}
      >
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
