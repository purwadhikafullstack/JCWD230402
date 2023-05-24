import React, { useEffect, useState } from "react";
import { CardCart } from "../components";
import {
  Text,
  Flex,
  Spinner,
  Table,
  Tr,
  Th,
  Box,
  Button,
} from "@chakra-ui/react";
import { API_URL } from "../helper";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { cartAction } from "../reducers/cart";

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("Gadgetwarehouse_userlogin");

  const params = new URLSearchParams(location.search);

  const [cartList, setCartList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTotal, setSubTotal] = useState("");
  const dispatch = useDispatch();

  function formating(params) {
    let total = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(params);

    return total;
  }

  const checkLogin = () => {
    if (!token) {
      navigate("/login");
    }
  };

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
      dispatch(cartAction(res.data.datanum));
    } catch (error) {
      console.log("error getMemory", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/product/cart/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getCart();
    } catch (error) {
      console.log("error delete one item", error);
    }
  };
  const removeAll = async () => {
    try {
      await axios.delete(`${API_URL}/product/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getCart();
    } catch (error) {
      console.log("error delete all item", error);
    }
  };

  const printCart = () => {
    return cartList.map((val, idx) => {
      return (
        <CardCart
          color={val.color.color}
          memory={val.memory.memory}
          brand={val.product.category.type}
          product={val.product.name}
          image={`${API_URL}${val.product.productImage}`}
          id={val.id}
          totalQty={val.totalQty}
          removeItem={removeItem}
          addItem={addItem}
          minusItem={minusItem}
          available={priceList[idx][0].available}
          price={priceList[idx][0].price}
          discount={priceList[idx][0].discount}
          discountedPrice={priceList[idx][0].discountedPrice}
          formattedprice={formating(priceList[idx][0].price)}
          formatteddiscount={formating(priceList[idx][0].discountedPrice)}
          totalperitem={formating(
            priceList[idx][0].discountedPrice * val.totalQty
          )}
        />
      );
    });
  };

  const minusItem = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/product/minus-cart`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getCart();
    } catch (error) {
      console.log("error delete all item", error);
    }
  };

  const addItem = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/product/plus-cart`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getCart();
    } catch (error) {
      console.log("error additem", error);
    }
  };

  const calculate = () => {
    let result = 0;

    cartList.forEach((val, idx) => {
      result += priceList[idx][0].discountedPrice * val.totalQty;
    });
    sessionStorage.setItem("total all item", result);

    const formated = formating(result);
    setSubTotal(formated);
  };

  useEffect(() => {
    checkLogin();
    getCart();
  }, []);

  useEffect(() => {
    if (cartList.length > 0) {
      calculate();
    }
  }, [cartList]);

  return (
    <>
      {loading === true ? (
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
      ) : cartList.length === 0 ? (
        <>
          <Flex
            my={{ base: "60", md: "80" }}
            color={"white"}
            maxW={"100vw"}
            mx={"auto"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={7}
          >
            <Text as={"h1"} fontWeight={"semibold"} fontSize={"3xl"}>
              Your Cart is Empty
            </Text>
            <Button
              onClick={() => {
                navigate("/product/all-products");
              }}
              p="7"
              fontSize={"2xl"}
              variant={"filled"}
              bgColor={"#019053"}
              color={"white"}
              _hover={{ color: "black", bgColor: "#1BFD9C" }}
            >
              Shop Our Products
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Flex
            width={"full"}
            alignItems={"center"}
            justifyContent={"center"}
            mt={{ base: "24", md: "36" }}
            color={"white"}
          >
            <Text
              as={"h1"}
              fontSize={{ md: "xl", base: "lg" }}
              letterSpacing={"widest"}
            >
              Shopping Cart
            </Text>
          </Flex>

          <Table
            display={{ base: "none", md: "table" }}
            mt={8}
            maxW={"5xl"}
            mx={"auto"}
          >
            <Tr>
              <Th w={{ md: "55%" }} borderBottomColor={"gray.700"}>
                <Text
                  color={"white"}
                  textAlign={"center"}
                  fontSize={"lg"}
                  fontWeight={"semibold"}
                >
                  Product
                </Text>
              </Th>
              <Th w={"22.5%"} borderBottomColor={"gray.700"}>
                <Text
                  color={"white"}
                  textAlign={"center"}
                  fontSize={"lg"}
                  fontWeight={"semibold"}
                >
                  Quantity
                </Text>
              </Th>
              <Th w={"22.5%"} borderBottomColor={"gray.700"}>
                <Text
                  color={"white"}
                  textAlign={"center"}
                  fontSize={"lg"}
                  fontWeight={"semibold"}
                >
                  Total
                </Text>
              </Th>
            </Tr>
          </Table>
          <Box
            mt={{ base: "5", md: "8" }}
            mb={{ base: "3", md: "5" }}
            maxW={"5xl"}
            mx={"auto"}
          >
            <Flex flexDir={"column"} gap={{ base: 7 }}>
              {printCart()}
              <Text
                as={"button"}
                textAlign={"right"}
                color={"red.600"}
                textUnderlineOffset={"3px"}
                textDecoration="underline"
                onClick={removeAll}
                fontSize={{ md: "lg", lg: "xl" }}
              >
                Empty Cart
              </Text>
            </Flex>
          </Box>

          <Box
            maxW={"5xl"}
            mx={"auto"}
            mt="8"
            mb={"8"}
            py="4"
            borderTop={"1px"}
            borderColor={"gray.400"}
          >
            <Flex px="4" flexDir={"column"} color={"#1BFD9C"}>
              <Text
                color={"white"}
                as={"h1"}
                textAlign={"center"}
                fontWeight={"normal"}
                fontSize={"xl"}
                letterSpacing={"wider"}
                mb={4}
              >
                Details
              </Text>
              <Flex flexDir={"column"} alignItems={"flex-end"}>
                <Text
                  as={"h2"}
                  letterSpacing={"wider"}
                  fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                  mb={3}
                >
                  <Text as="span" color={"white"}>
                    TOTAL :
                  </Text>{" "}
                  {subTotal}
                </Text>
                <Text
                  mb={3}
                  color={"white"}
                  letterSpacing={"wide"}
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                >
                  Shipping & Taxes Calculated at Checkout
                </Text>
              </Flex>

              <Flex
                maxW={"full"}
                justifyContent={{ base: "center", md: "flex-end" }}
                mt="2"
              >
                <Button
                  w={{ base: "100%", md: "50%", xl: "40%" }}
                  variant={"solid"}
                  color={"black"}
                  _hover={{ color: "white", scale: "105", bgColor: "#34D399" }}
                  bgColor={"#019d5a"}
                  rounded={"lg"}
                  transitionDuration={"500"}
                  onClick={() => navigate("/checkout")}
                >
                  <Text
                    letterSpacing={"wider"}
                    fontsize={{ base: "xl", md: "2xl" }}
                  >
                    CHECKOUT
                  </Text>
                </Button>
              </Flex>
            </Flex>
          </Box>
        </>
      )}
    </>
  );
}

export default CartPage;
