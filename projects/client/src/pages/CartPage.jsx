import React, { useEffect, useState } from "react";
import { CardCart } from "../components";
import {
  Text,
  Flex,
  Spinner,
  Table,
  Tr,
  Th,
  Tbody,
  Thead,
  TableContainer,
  Box,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { API_URL } from "../helper";
import axios from "axios";
import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("Gadgetwarehouse_userlogin");

  const params = new URLSearchParams(location.search);

  let defautlPage = parseInt(params.get("page")) - 1 || 0;

  const [page, setPage] = useState(defautlPage);
  const [size] = useState(8); // to change how many items per page
  const [totalData, setTotalData] = useState(0);
  const [cartList, setCartList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log("pricelist", priceList);

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

  const getCart = async () => {
    try {
      let res = await axios.get(`${API_URL}/product/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", res);
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
      // console.log("cart content", priceList[idx][0].available);
      return (
        <CardCart
          color={val.color.color}
          memory={val.memory.memory}
          brand={val.product.category.type}
          product={val.product.name}
          image={val.product.productImage}
          id={val.id}
          totalQty={val.totalQty}
          removeItem={removeItem}
          addItem={addItem}
          minusItem={minusItem}
          available={priceList[idx][0].available}
        />
      );
    });
  };

  const minusItem = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/product/minuscart`,
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
        `${API_URL}/product/pluscart`,
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

  useEffect(() => {
    getCart();
  }, []);

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
            mt={{ base: 24, md: "36" }}
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

          {/* <Flex
        width={"full"}
        color={"white"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <TableContainer mt={"20px"} width={"full"}>
          <Table>
            <Thead>
              <Tr>
                <Th textColor={"white"}>Product</Th>
                <Th textColor={"white"}>Quantity</Th>
                <Th textColor={"white"}>Total</Th>
              </Tr>
            </Thead>
            <Tbody></Tbody>
          </Table>
        </TableContainer>
      </Flex> */}
          <Box
            mt={{ base: "5", md: "8" }}
            mb={{ base: "3", md: "5" }}
            maxW={"5xl"}
            mx={"auto"}
          >
            <Flex flexDir={"column"} gap={{ base: 7 }}>
              {printCart()}
              <Text
                mt={3}
                as={"button"}
                textAlign={"right"}
                color={"red.600"}
                textDecoration="underline"
                onClick={removeAll}
              >
                Empty Cart
              </Text>
            </Flex>
          </Box>

          <Box
            maxW={"5xl"}
            mx={"auto"}
            mb={"4"}
            py="5"
            borderTop={"1px"}
            borderColor={"gray.400"}
          >
            <Flex px="4" flexDir={"column"} gap={"3"} color={"#1BFD9C"}>
              <Text as={"h1"} textAlign={"center"} fontWeight={"semibold"}>
                Details
              </Text>
              <Flex flexDir={"column"} alignItems={"flex-end"}>
                <Text as={"h3"} mb={2}>
                  Total: $(total price)
                </Text>
                <Text>Shipping & Taxes Calculated at Checkout</Text>
              </Flex>

              <Flex maxW={"full"} justifyContent={"flex-end"} mt="2">
                <button className="text-white hover:text-black hover:scale-105 bg-emerald-400 hover:bg-emerald-300 rounded-lg p-1 duration-500">
                  Proceed To Checkout
                </button>
              </Flex>
            </Flex>
          </Box>
        </>
      )}
    </>
  );
}

export default CartPage;
