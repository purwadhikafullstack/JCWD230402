import {
  Flex,
  Text,
  Spinner,
  Box,
  Button,
  ButtonGroup,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../helper";
import axios from "axios";
import SwiperCarousel from "../components/Swiper";
import { GoPrimitiveDot } from "react-icons/go";
import { CiDiscount1 } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { loginAction } from "../reducers/auth";
import { cartAction } from "../reducers/cart";

function ProductPage() {
  const statusId = useSelector((state) => state.authReducer.statusId);
  const customerEmail = useSelector((state) => state.authReducer.email);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const params = useParams();
  const nameFromURL = params.productname.replace(/_/g, " ");
  const [activeColor, setActiveColor] = useState(null);
  const [activeMemory, setActiveMemory] = useState(null);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [colorVarList, setColorVarList] = useState([]);
  const [memoryVarList, setMemoryVarList] = useState([]);
  const [colorPick, setColorPick] = useState(0);
  const [memoryPick, setMemoryPick] = useState(0);
  const [priceList, setPriceList] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [minus, setMinus] = useState(true);
  const [plus, setPlus] = useState(true);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState("password");

  const getProduct = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/product/one-product/?name=${nameFromURL}`
      );

      setProductData(res.data.data);
      setLoading(false);
      if (!res.data.data) {
        navigate("*");
      }
    } catch (error) {
      console.log("error get product = ", error);
    }
  };

  const printDescription = () => {
    const sentences = productData[0]?.product.description.split(". ");

    const sentenceGroups = [];
    for (let i = 0; i < sentences.length; i += 4) {
      const group = sentences.slice(i, i + 4);
      sentenceGroups.push(group.join(". "));
    }
    return (
      <>
        {sentenceGroups.map((group, index) => (
          <Text key={index} lineHeight={"8"} mb="3" fontSize={{ base: "md" }}>
            {group}
          </Text>
        ))}
      </>
    );
  };

  const getColors = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/product/color-product/?name=${nameFromURL}`
      );
      setColorVarList(res.data.data);
    } catch (error) {
      console.log("error getColors = ", error);
    }
  };

  const printColors = () => {
    return colorVarList.map((val) => {
      return (
        <Button
          as={"button"}
          boxShadow={"dark-lg"}
          variant={activeColor === val.color.id ? "outline" : "solid"}
          borderColor={"green.500"}
          pl={2}
          py={1}
          color={val.color.hexCode}
          backgroundColor={"transparent"}
          leftIcon={<GoPrimitiveDot size={"22px"} />}
          _hover={{ bg: "#32CD32" }}
          fontSize={{ base: "xl" }}
          letterSpacing={"widest"}
          textAlign={"center"}
          onClick={() => {
            if (colorPick === val.color.id) {
              setColorPick(0);
              setActiveColor(null);
              setMemoryVarList([]);
              setMemoryPick(0);
              setActiveMemory(null);
            } else {
              setColorPick(val.color.id);
              setActiveColor(val.color.id);
              setMemoryPick(0);
              setActiveMemory(null);
            }
          }}
        >
          {val.discount === 0 ? (
            <Text color={"white"} mb={{ base: "0.5" }}>
              {val.color.color}
            </Text>
          ) : (
            <Text color={"white"} mt={{ base: "1" }}>
              {val.color.color}
              <Icon
                mb={1}
                ml={2}
                color={"red.500"}
                fontSize={{ base: "25px" }}
                as={CiDiscount1}
              />
            </Text>
          )}
        </Button>
      );
    });
  };

  const getMemory = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/product/memory-product/?name=${nameFromURL}&colorId=${colorPick}`
      );

      setMemoryVarList(res.data.data);
    } catch (error) {
      console.log("error getMemory", error);
    }
  };

  const printMemory = () => {
    return memoryVarList.map((val) => {
      return (
        <Button
          mb={{ base: 3, lg: 5 }}
          as={"button"}
          boxShadow={"dark-lg"}
          variant={activeMemory === val.memory.id ? "outline" : "solid"}
          borderColor={
            val.statusId === 3 || val.available == 0 ? "red.500" : "green.500"
          }
          py={1}
          opacity={val.statusId === 3 || val.available == 0 ? "0.6" : "1"}
          backgroundColor={
            val.statusId === 3 || val.available == 0
              ? "gray.400"
              : "transparent"
          }
          isDisabled={val.statusId === 3 || val.available == 0 ? true : false}
          _hover={{ bg: "#32CD32" }}
          fontSize={{ base: "xl" }}
          letterSpacing={"widest"}
          textAlign={"center"}
          onClick={() => {
            if (memoryPick === val.memory.id) {
              setMemoryPick(0);
              setActiveMemory(null);
            } else {
              setMemoryPick(val.memory.id);
              setActiveMemory(val.memory.id);
            }
          }}
        >
          {val.discount === 0 ? (
            <Text
              color={
                val.statusId === 3 || val.available == 0 ? "gray.600" : "white"
              }
              opacity={"1"}
            >
              {val.memory.memory}
            </Text>
          ) : (
            <Text
              color={
                val.statusId === 3 || val.available == 0 ? "gray.600" : "white"
              }
              opacity={"1"}
              mt={{ base: "1" }}
            >
              {val.memory.memory}
              <Icon
                mb={1}
                ml={2}
                color={"red.500"}
                fontSize={{ base: "25px" }}
                as={CiDiscount1}
              />
            </Text>
          )}
        </Button>
      );
    });
  };

  const getPrice = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/product/price-product/?name=${nameFromURL}&colorId=${colorPick}&memoryId=${memoryPick}`
      );
      setPriceList(res.data);
    } catch (error) {
      console.log("error getprice", error);
    }
  };

  const printPrice = () => {
    if (priceList?.data[0]?.discount === 0) {
      return (
        <Box mt={{ base: "5" }}>
          <Text
            as={"span"}
            textAlign={{ base: "center", lg: "left" }}
            color={priceList?.stock > 10 ? "#1BFD9C" : "red.500"}
            // display={{ base: "none", lg: "block" }}
            mb={{ base: "4" }}
            border={"1px"}
            rounded={"lg"}
            cursor={"none"}
            py={"0.5"}
            px="1"
          >
            {priceList?.stock > 10
              ? "AVAILABLE"
              : `${priceList?.stock} Remaining`}
          </Text>
          <Flex
            mb={{ base: "5", xl: "8" }}
            alignItems={"center"}
            gap={5}
            justifyContent={{ base: "center", lg: "flex-start" }}
          >
            <Text
              textAlign={"center"}
              fontSize={{ base: "3xl", xl: "4xl" }}
              letterSpacing={"tight"}
            >
              {priceList?.formatedDiscount}
            </Text>
          </Flex>
        </Box>
      );
    } else {
      return (
        <Box mt={{ base: "5" }}>
          <Flex
            gap={5}
            alignItems={"center"}
            justifyContent={{ base: "center", lg: "flex-start" }}
            mb={{ base: "4" }}
          >
            <Text
              as={"span"}
              border={"1px"}
              rounded={"lg"}
              cursor={"none"}
              py={"0.5"}
              px="1"
              color={priceList?.stock > 10 ? "#1BFD9C" : "red.500"}
            >
              {priceList?.stock > 10
                ? "AVAILABLE"
                : `${priceList?.stock} Remaining`}
            </Text>
            <Text
              display={"block"}
              as={"s"}
              opacity={0.3}
              textAlign={"center"}
              fontSize={{ base: "lg", xl: "xl" }}
              letterSpacing={"tight"}
            >
              {priceList?.formatedPrice}
            </Text>
          </Flex>
          <Flex
            mb={{ base: "5", xl: "8" }}
            alignItems={"center"}
            gap={3}
            justifyContent={{ base: "center", lg: "flex-start" }}
          >
            <Flex
              backgroundColor={"rgba(52,211,153,0.1)"}
              rounded={"xl"}
              px={"7px"}
              mt={1}
            >
              <Text color={"#34D399"} mb="3px" ml={"1px"} textAlign={"center"}>
                <Icon mr="5px" as={CiDiscount1} />(
                {priceList?.data[0].discount * 100}%)
              </Text>
            </Flex>

            <Text
              color={"#34D399"}
              textAlign={"center"}
              fontSize={{ base: "3xl", xl: "4xl" }}
              letterSpacing={"tight"}
            >
              {priceList?.formatedDiscount}
            </Text>
          </Flex>
        </Box>
      );
    }
  };

  const getCart = async () => {
    try {
      const token = localStorage.getItem("Gadgetwarehouse_userlogin");
      let res = await axios.get(`${API_URL}/product/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(cartAction(res.data.datanum));
    } catch (error) {
      console.log("error getCart", error);
    }
  };

  //================================================================== on Cart button click
  const onCartClick = async () => {
    try {
      if (!statusId || statusId === 1) {
        // klo gk login, verified
        onOpen();
      } else {
        const token = localStorage.getItem("Gadgetwarehouse_userlogin");
        await axios.post(
          `${API_URL}/product/cart`,
          {
            product: nameFromURL,
            color: colorPick,
            memory: memoryPick,
            qty: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast({
          title: "Item Added to Cart",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        // if success get cart
        getCart();
      }
    } catch (error) {
      if (error.response.data.message) {
        toast({
          title: "Failed to add item to cart",
          description: `${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        console.log("onCartClick error = ", error);
      }
    }
  };

  const showpassword = () => {
    if (visible === "password") {
      setVisible("text");
    } else {
      setVisible("password");
    }
  };

  const onBtnLogin = async () => {
    try {
      if (email === "" || password === "") {
        alert("Please enter your credentials");
      } else {
        let res = await axios.post(`${API_URL}/auth/customer`, {
          email: email,
          password: password,
        });
        localStorage.setItem("Gadgetwarehouse_userlogin", res.data.token);
        dispatch(loginAction(res.data));
        setEmail("");
        setPassword("");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Login Failed.",
        description: `${error.response.data.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const minusCheck = () => {
    if (quantity === 0) {
      setMinus(true);
    } else {
      setMinus(false);
    }
  };

  const plusCheck = () => {
    if (quantity + 1 > priceList?.stock) {
      setPlus(true);
    } else {
      setPlus(false);
    }
  };

  useEffect(() => {
    getProduct();
    getColors();
    // getDetails();
  }, []);

  useEffect(() => {
    if (colorPick !== 0) {
      getMemory();
    }
  }, [colorPick]);

  useEffect(() => {
    if (colorPick !== 0 && memoryPick !== 0) {
      getPrice();
      setPlus(false);
    }
  }, [memoryPick]);

  useEffect(() => {
    minusCheck();
    plusCheck();
  }, [quantity]);

  return (
    <>
      {loading === true ? (
        <Flex
          justifyContent={"center"}
          my={{ base: "24", md: "36" }}
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
        <>
          <Flex
            mt={{ base: 24, md: "36" }}
            maxW={"100vw"}
            color={"white"}
            wrap={"wrap"}
            mb={8}
            justifyContent={"space-around"}
            bg={"transparent"}
          >
            {/* ========================================================== Carousel ==================================================================== */}
            <Box
              maxW={{ base: "full", lg: "45%", xl: "45%" }}
              minH={{ lg: "284px" }}
            >
              <SwiperCarousel
                productPictures={productData[0]?.product.pictures}
              />
            </Box>
            {/*==========================================================================================================================================  */}
            <Box
              color={"white"}
              w={{ base: "full", lg: "50%" }}
              bgColor={"transparent"}
              pl={{ base: 1, lg: 5 }}
            >
              <Text
                textAlign={{ base: "center", lg: "initial" }}
                fontSize={{ base: "xl", lg: "lg", xl: "2xl" }}
                mt={{ base: "5" }}
                letterSpacing={"widest"}
              >
                {/*  product brand */}
                {productData[0]?.product.category.type}
              </Text>
              <Text
                textAlign={{ base: "center", lg: "initial" }}
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight={{ lg: "semibold" }}
                mt={{ base: "3", lg: "2.5" }}
                letterSpacing={{ base: "widest", md: "wider" }}
              >
                {/*  product name */}
                {productData[0]?.product.name}
              </Text>
              {memoryPick === 0 ? null : printPrice()}
              {/* ============================================================================================================================================ */}
              <Text
                textAlign={"initial"}
                fontSize={{ base: "2xl", lg: "3xl" }}
                mt={{ base: "5" }}
                fontWeight={{ lg: "semibold" }}
                letterSpacing={"wider"}
              >
                {/*  product colors */}
                Colors :
              </Text>
              <ButtonGroup mt="4" gap={{ base: "3" }}>
                {printColors()}
              </ButtonGroup>
              <Text
                textAlign={"initial"}
                mt={{ base: "5" }}
                fontSize={{ base: "2xl", lg: "3xl" }}
                fontWeight={{ lg: "semibold" }}
                letterSpacing={"wider"}
              >
                {/*  product memories */}
                Capacity :
              </Text>
              {activeColor === null ? (
                <Text
                  mt={{ base: "4", lg: "4" }}
                  color="#00FF00"
                  opacity={"0.4"}
                >
                  Choose a color to see variations
                </Text>
              ) : (
                <ButtonGroup gap={"3"} mt={{ base: "4", lg: "4" }}>
                  {printMemory()}
                </ButtonGroup>
              )}
              {/* =============================================================================description====================================================== */}
              <Flex
                w="full"
                wordBreak={"break-word"}
                direction={"column"}
                mt={{ base: "5", lg: "5" }}
              >
                <Text
                  fontSize={{ base: "2xl", lg: "3xl" }}
                  fontWeight={{ lg: "semibold" }}
                  letterSpacing={"wider"}
                  lineHeight={"8"}
                  mb="4"
                >
                  Description
                </Text>
                {printDescription()}
              </Flex>
              <Box
                color={"white"}
                w={{ base: "full" }}
                bgColor={"transparent"}
                pl={{ base: 0, lg: 5 }}
                pr={{ base: 0, lg: 5 }}
              >
                {/* price */}

                <Flex
                  w={"full"}
                  justifyContent={"space-around"}
                  mt={{ base: "10", lg: "3" }}
                >
                  <ButtonGroup
                    py={{ base: 1, md: 1.5 }}
                    alignItems={"center"}
                    mb={{ base: 10, lg: 8 }}
                    variant={"filled"}
                    border={"1px"}
                    borderColor={"green.500"}
                    rounded={{ base: "lg", lg: "md" }}
                    minW={{ base: "25%", md: "18%", lg: "35%", xl: "20%" }}
                    maxW={{ base: "50%", md: "18%", lg: "35%", xl: "20%" }}
                    justifyContent={"space-between"}
                  >
                    <Button
                      onClick={() => {
                        setQuantity(quantity - 1);
                      }}
                      isDisabled={minus}
                    >
                      -
                    </Button>
                    <Text fontSize={{ base: "xl" }}>{quantity}</Text>

                    <Button
                      isDisabled={plus}
                      onClick={() => {
                        setQuantity(quantity + 1);
                      }}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                  <Button
                    py={{ base: 6, md: "26px" }}
                    isDisabled={
                      colorPick !== 0 && memoryPick !== 0 && quantity !== 0
                        ? false
                        : true
                    }
                    as="button"
                    bgColor={"#00FF00"}
                    opacity={0.6}
                    rounded={"lg"}
                    w={{ base: "40%", md: "45%", lg: "55%", xl: "50%" }}
                    _hover={{ bgColor: "#7FFF00" }}
                    onClick={() => {
                      onCartClick();
                    }}
                  >
                    <Text
                      color={"black"}
                      opacity={"1"}
                      fontSize={{ base: "lg", lg: "xl" }}
                      letterSpacing={"wider"}
                    >
                      Add To Cart
                    </Text>
                  </Button>
                </Flex>
                {/* ================================================================================================= LOGIN MODAL ==================================================================================== */}
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent backgroundColor={"#18181B"} color={"white"}>
                    <ModalHeader
                      color={"#1BFD9C"}
                      fontWeight={"bold"}
                      fontSize={"3xl"}
                      textAlign={"center"}
                    >
                      Welcome
                    </ModalHeader>
                    <ModalHeader fontWeight={"bold"} fontSize={"lg"}>
                      Ready for shopping?
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />
                    <ModalBody>
                      <Stack gap={3}>
                        <Flex flexDirection={"column"} gap={"3"}>
                          <FormControl>
                            <FormLabel
                              fontWeight={"semibold"}
                              color={"#6EE7B7"}
                            >
                              Email
                            </FormLabel>
                            <Input
                              onChange={(e) => setEmail(e.target.value)}
                              type="email"
                              placeholder="Your Email"
                              rounded={"3xl"}
                              px="2"
                              bg={"transparent"}
                              border={"1px"}
                              borderColor={"#6EE7B7"}
                              outline={"none"}
                            />
                          </FormControl>
                        </Flex>

                        <Flex flexDir={"column"} gap={2}>
                          <FormControl>
                            <FormLabel
                              fontWeight={"semibold"}
                              color={"#6EE7B7"}
                            >
                              Password
                            </FormLabel>
                            <InputGroup>
                              <Input
                                onChange={(e) => setPassword(e.target.value)}
                                type={visible}
                                placeholder="Your Password"
                                rounded={"3xl"}
                                px="2"
                                bg={"transparent"}
                                border={"1px"}
                                borderColor={"#6EE7B7"}
                                outline={"none"}
                                input
                              />
                              <InputRightAddon
                                cursor={"pointer"}
                                bgColor={"transparent"}
                                px={1}
                                fontSize={"xl"}
                                borderTopRightRadius={"3xl"}
                                borderBottomRightRadius={"3xl"}
                                border={"1px"}
                                borderColor={"#6EE7B7"}
                                color={"#1BFD9C"}
                                type="button"
                                onClick={showpassword}
                              >
                                {visible === "password" ? (
                                  <Icon as={HiEyeOff} />
                                ) : (
                                  <Icon as={HiEye} />
                                )}
                              </InputRightAddon>
                            </InputGroup>
                          </FormControl>
                        </Flex>
                        <div className="w-full flex justify-center">
                          <button
                            type="button"
                            className="text-white bg-emerald-400 font-bold border border-[#1BFD9C] rounded-xl w-1/2 mx-auto mt-4 hover:bg-emerald-300 hover:border-white hover:text-black duration-500 hover:scale-110"
                            onClick={onBtnLogin}
                          >
                            Login
                          </button>
                        </div>
                        <p className="text-center font-bold text-white">
                          -- or Sign in with --
                        </p>
                        <div className="flex justify-evenly py-2">
                          <button className="bg-slate-200 border-2 border-[#1BFD9C] w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-110 duration-500">
                            <FcGoogle className="m-auto" />
                          </button>
                          <button className="bg-slate-200 border-2 border-[#1BFD9C] w-10 h-10 py-1 rounded-[100%] cursor-pointer hover:scale-110 duration-500">
                            <BsFacebook className="m-auto" />
                          </button>
                        </div>
                        <p className="font-semibold text-center">
                          forgot your{" "}
                          <NavLink
                            to="/request"
                            className="text-[#1BFD9C] hover:scale-110 duration-500"
                          >
                            password
                          </NavLink>{" "}
                          ?
                        </p>
                      </Stack>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                {/* ================================================================================================= LOGIN MODAL ==================================================================================== */}
              </Box>
            </Box>
          </Flex>

          <Accordion
            allowToggle
            mb={{ base: 8, lg: 10 }}
            borderColor={"whiteAlpha.400"}
          >
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="left"
                    color={"white"}
                    fontWeight={"semibold"}
                    letterSpacing={"wide"}
                    py="1"
                  >
                    Product Details
                  </Box>
                  <AccordionIcon color={"white"} />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} color={"white"}>
                <Text>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio
                  harum commodi similique sit obcaecati labore delectus
                  veritatis molestias consequuntur maiores maxime necessitatibus
                  quos, dicta rerum autem consequatur iste nulla nesciunt?Lorem
                  ipsum, dolor sit amet consectetur adipisicing elit. Dolores,
                  neque. Exercitationem ratione incidunt cum. Asperiores impedit
                  esse iste in quidem magni vero! Quae error debitis architecto
                  et iure, dolores quo. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Libero officia dolore nam eum mollitia
                  facere ipsa distinctio repellendus fugiat quis unde maxime
                  voluptatem omnis, quod eius culpa magnam veniam minima! Lorem,
                  ipsum dolor sit amet consectetur adipisicing elit. Non quia
                  nostrum corrupti ea porro. Consectetur a saepe quia id nemo
                  similique molestiae suscipit, placeat quas delectus iusto ab
                  cum eligendi.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      )}
    </>
  );
}

export default ProductPage;
