import {
  Flex,
  Text,
  Spinner,
  Box,
  Button,
  ButtonGroup,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../helper";
import axios from "axios";
import SwiperCarousel from "../components/Swiper";
import { GoPrimitiveDot } from "react-icons/go";
import { CiDiscount1 } from "react-icons/ci";

function ProductPage() {
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

  const getProduct = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/product/oneproduct/?name=${nameFromURL}`
      );

      setProductData(res.data.data);
      // console.log(productData);
      setLoading(false);
      if (!res.data.data) {
        navigate("*");
      }
    } catch (error) {
      console.log("error get product = ", error);
    }
  };
  const getColors = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/product/color/?name=${nameFromURL}`
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
        `${API_URL}/product/memory/?name=${nameFromURL}&colorId=${colorPick}`
      );

      setMemoryVarList(res.data.data);
    } catch (error) {
      console.log("error getMemory", error);
    }
  };
  const printMemory = () => {
    return memoryVarList.map((val) => {
      // console.log("print memory", val);
      return (
        <Button
          mb={{ base: 3, lg: 5 }}
          as={"button"}
          boxShadow={"dark-lg"}
          variant={activeMemory === val.memory.id ? "outline" : "solid"}
          borderColor={
            val.statusId === 3 || val.stock === 0 ? "red.500" : "green.500"
          }
          py={1}
          opacity={val.statusId === 3 || val.stock === 0 ? "0.6" : "1"}
          backgroundColor={
            val.statusId === 3 || val.stock === 0 ? "gray.400" : "transparent"
          }
          isDisabled={val.statusId === 3 || val.stock === 0 ? true : false}
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
                val.statusId === 3 || val.stock === 0 ? "gray.600" : "white"
              }
              opacity={"1"}
            >
              {val.memory.memory}
            </Text>
          ) : (
            <Text
              color={
                val.statusId === 3 || val.stock === 0 ? "gray.600" : "white"
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
        `${API_URL}/product/price/?name=${nameFromURL}&colorId=${colorPick}&memoryId=${memoryPick}`
      );
      setPriceList(res.data);
    } catch (error) {
      console.log("error getprice", error);
    }
  };
  const printPrice = () => {
    if (priceList?.data[0]?.discount === 0) {
      return (
        <Text
          textAlign={"center"}
          fontSize={{ base: "3xl" }}
          letterSpacing={"widest"}
          my={{ base: 5, lg: 5 }}
        >
          {priceList?.formatedDiscount}
        </Text>
      );
    } else {
      return (
        <>
          <Text
            display={"block"}
            as={"s"}
            opacity={0.3}
            textAlign={"center"}
            fontSize={{ base: "2xl", xl: "3xl" }}
            letterSpacing={"widest"}
            // mt={"4"}
            mb={{ base: "2", lg: "1.5" }}
          >
            {priceList?.formatedPrice}
          </Text>
          <Text
            color={"red.500"}
            textAlign={"center"}
            fontSize={{ base: "3xl", xl: "5xl" }}
            letterSpacing={"widest"}
            mb={{ base: "5", xl: "8" }}
          >
            {priceList?.formatedDiscount}
          </Text>
        </>
      );
    }
  };

  console.log("pricelist", priceList, memoryPick, colorPick);

  useEffect(() => {
    getProduct();
    getColors();
  }, []);
  useEffect(() => {
    if (colorPick !== 0) {
      getMemory();
    }
  }, [colorPick]);
  useEffect(() => {
    if (colorPick !== 0 && memoryPick !== 0) {
      getPrice();
      console.log("memorypick", memoryPick);
      console.log("colorpick", colorPick);
    }
  }, [memoryPick]);

  return (
    <>
      {loading === true ? (
        <Flex
          justifyContent={"center"}
          mt={{ base: 24, md: "36" }}
          color={"white"}
          maxW={"100vw"}
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
            gap={{ base: 3, lg: 10 }}
          >
            {/* ========================================================== Carousel ==================================================================== */}
            <Box
              maxW={{ base: "full", lg: "40%", xl: "40%" }}
              minH={{ lg: "284px" }}
            >
              <SwiperCarousel
                productPictures={productData[0]?.product.pictures}
              />
            </Box>
            {/*==========================================================================================================================================  */}
            <Box
              color={"white"}
              w={{ base: "full", lg: "45%" }}
              bgColor={"transparent"}
              pl={{ base: 1, lg: 5 }}
            >
              <Text
                textAlign={{ base: "center", lg: "initial" }}
                fontSize={{ base: "xl", lg: "lg", xl: "2xl" }}
                mt={{ base: "4" }}
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
              {/* ======================================================================================================== */}
              <Text
                textAlign={"initial"}
                fontSize={{ base: "lg" }}
                mt={{ base: "4" }}
                fontWeight={{ lg: "semibold" }}
                letterSpacing={"wider"}
              >
                {/*  product colors */}
                Colors :
              </Text>
              <ButtonGroup mt="3" gap={{ base: "3" }}>
                {printColors()}
              </ButtonGroup>
              <Text
                textAlign={"initial"}
                mt={{ base: "4" }}
                mb={{ base: "3" }}
                fontSize={{ base: "lg" }}
                fontWeight={{ lg: "semibold" }}
                letterSpacing={"wider"}
              >
                {/*  product memories */}
                Capacity :
              </Text>
              {activeColor === null ? (
                <Text
                  my={{ base: "5", lg: "8" }}
                  color="#00FF00"
                  opacity={"0.4"}
                >
                  Choose a color to see variations
                </Text>
              ) : (
                <ButtonGroup gap={"3"} mb={{ base: "2" }}>
                  {printMemory()}
                </ButtonGroup>
              )}
              {/* =============================================================================description====================================================== */}
              <Flex
                w="full"
                wordBreak={"break-word"}
                direction={"column"}
                mt={4}
              >
                <Text lineHeight={"8"} mb="3" fontSize={{ base: "md" }}>
                  {productData[0]?.product.description}
                </Text>
                <Text lineHeight={"8"} mb="3" fontSize={{ base: "md" }}>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Inventore ipsum ex quaerat deserunt ipsam quibusdam blanditiis
                  placeat voluptates dolore rerum corrupti sapiente
                  reprehenderit facere, error maiores soluta magnam enim quam?
                </Text>
              </Flex>
              <Box
                color={"white"}
                w={{ base: "full" }}
                bgColor={"transparent"}
                pl={{ base: 0, lg: 5 }}
                pr={{ base: 0, lg: 5 }}
              >
                {/* price */}
                {memoryPick === 0 ? null : printPrice()}

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
                      isDisabled={quantity == 0 ? true : false}
                    >
                      -
                    </Button>
                    <Text fontSize={{ base: "xl" }}>{quantity}</Text>
                    <Button
                      onClick={() => {
                        setQuantity(quantity + 1);
                      }}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                  <Button
                    py={{ base: 6, md: "26px" }}
                    as="button"
                    bgColor={"#00FF00"}
                    opacity={0.6}
                    rounded={"lg"}
                    w={{ base: "40%", md: "45%", lg: "55%", xl: "50%" }}
                    _hover={{ bgColor: "#7FFF00" }}
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
              </Box>
            </Box>
          </Flex>
        </>
      )}
    </>
  );
}

export default ProductPage;
