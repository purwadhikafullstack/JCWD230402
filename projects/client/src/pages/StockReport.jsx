import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Flex,
  Heading,
  Spinner,
  Td,
  HStack,
  StackDivider,
  Select,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from "@chakra-ui/react";

import axios from "axios";
import { API_URL } from "../helper";
import { useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

function StockReport() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const defautlPage = parseInt(params.get("page")) - 1 || 0;
  const defaultOrder = params.get("orderby") || "DESC";

  const roleId = useSelector((state) => state.adminReducer.roleId);
  const warehouseId = useSelector((state) => state.adminReducer.warehouseId);
  const [loading, setLoading] = useState(true);
  const [warehouse, setWarehouse] = useState(warehouseId || 0);
  const token = localStorage.getItem("gadgetwarehouse_adminlogin");
  const [warehouseList, setWarehouseList] = useState([]);

  const today = new Date();
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);
  const [addition, setAddition] = useState(0);
  const [subtraction, setSubtraction] = useState(0);
  const [finalStock, setFinalStock] = useState(0);
  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState(0);
  const [stockList, setStockList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [orderby, setOrderBy] = useState(defaultOrder);
  const [page, setPage] = React.useState(defautlPage);
  const [size] = React.useState(8);

  // console.log("warehouse", warehouse);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [startDate, setStartdate] = useState(
    sevenDaysAgo.toISOString().split("T")[0]
  );

  const end = new Date(endDate);
  const start = new Date(startDate);

  // Calculate the difference in milliseconds
  const differenceInMillis = end - start;

  // Convert milliseconds to days
  const dayDifference = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));

  function dateFormat(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      date
    );
    const day = date.getDate();
    const time = new Intl.DateTimeFormat("en-ID", {
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(date);
    return `${day} ${month} ${year}, ${time}`;
  }

  const getAllWarehouse = async () => {
    try {
      if (roleId === 1) {
        let res = await axios.get(`${API_URL}/warehouse/all-warehouse`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWarehouseList(res.data);
      }
    } catch (error) {
      console.log("error getallwarehouse", error);
    }
  };

  const printWarehouseOption = () => {
    return warehouseList.map((val) => {
      return (
        <option style={{ backgroundColor: "#303032" }} value={val.id}>
          {val.name}
        </option>
      );
    });
  };

  const getAllProduct = async () => {
    try {
      let res = await axios.get(`${API_URL}/report/product-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductList(res.data);
    } catch (error) {
      console.log("error get all product = ", error);
    }
  };

  const printAllProduct = () => {
    return productList.map((val) => {
      return (
        <option style={{ backgroundColor: "#303032" }} value={val.uuid}>
          {val.name}
        </option>
      );
    });
  };

  const getSummary = async () => {
    try {
      if (dayDifference > 7) {
        alert("Please limit your range to 7 days max.");
        setAddition("-");
        setSubtraction("-");
        setFinalStock("-");
        return;
      }

      const res = await axios.get(
        `${API_URL}/report/summary?warehouse=${warehouse}&startdate=${startDate}&enddate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setAddition(res.data.addition);
      setSubtraction(res.data.subtraction);
      setFinalStock(res.data.finalStock);
    } catch (error) {
      console.log("error getSummary =", error);
    }
  };

  const getStockMutation = async () => {
    try {
      if (dayDifference > 7) {
        setStockList([]);
        return;
      }

      const res = await axios.get(
        `${API_URL}/report/all-stockmutation?warehouse=${warehouse}&product=${product}&orderby=${orderby}&startdate=${startDate}&enddate=${endDate}&page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStockList(res.data.changes);
      setTotalData(res.data.datanum);
    } catch (error) {
      console.log("error getStockMutation", error);
    }
  };

  function shorten(params) {
    return params.toUpperCase().split("-")[params.split("-").length - 1];
  }

  const printTable = () => {
    return stockList.map((val, idx) => {
      return (
        <Tr>
          <Td textAlign={"center"}>{idx + 1 + page * size}</Td>
          {!val.order ? (
            <Td textAlign={"center"}>-</Td>
          ) : (
            <Td textAlign={"center"}>{shorten(val?.order.uuid)}</Td>
          )}
          <Td textAlign={"center"}>{val?.type.product.name}</Td>
          <Td textAlign={"center"}>{val?.initialStock}</Td>
          <Td textAlign={"center"}>+ {val?.addition}</Td>
          <Td textAlign={"center"}>- {val?.subtraction}</Td>
          <Td textAlign={"center"}>{val.warehouse?.name || "-"}</Td>
          <Td textAlign={"center"}>{dateFormat(val?.createdAt)}</Td>
        </Tr>
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

  function ordering(sortby) {
    setOrderBy(sortby);
    params.set("orderby", sortby);
    navigate({ search: params.toString() });
  }

  useEffect(() => {
    getAllWarehouse();
    getAllProduct();
  }, []);

  useEffect(() => {
    getSummary();
  }, [warehouse, endDate, startDate]);

  useEffect(() => {
    getStockMutation();
  }, [warehouse, endDate, startDate, product, orderby, page]);

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
      ) : (
        <Box
          mt={"20px"}
          color={"white"}
          mx={"auto"}
          px={{ base: "4", lg: "8" }}
        >
          <Flex justifyContent={"space-between"} mb={8}>
            <Heading size={{ md: "md", lg: "lg" }} fontStyle="inherit">
              Stock Report
            </Heading>

            <Flex gap={4} justifyContent={roleId === 1 ? "center" : "normal"}>
              <Flex alignItems={"center"} gap={3}>
                <Text>Start Date:</Text>
                <Input
                  type="date"
                  mr={{
                    base: "4px",
                    md: "3",
                  }}
                  mb={{ base: "0", md: "0" }}
                  width={{
                    base: "100%",
                    md: "auto",
                  }}
                  maxW={{
                    base: "155px",
                    md: "unset",
                  }}
                  onChange={(e) => setStartdate(e.target.value)}
                  defaultValue={startDate}
                  focusBorderColor="#34D399"
                  borderColor="#34D399"
                  borderWidth="2px"
                  _placeholder={{
                    color: "#D3212D",
                  }}
                  letterSpacing={"tighter"}
                  fontWeight={"semibold"}
                  _hover={""}
                />
              </Flex>
              <Flex alignItems={"center"} gap={3}>
                <Text>End Date:</Text>
                <Input
                  type="date"
                  ml={{
                    base: "4px",
                    md: "3",
                  }}
                  width={{
                    base: "100%",
                    md: "auto",
                  }}
                  maxW={{
                    base: "155px",
                    md: "unset",
                  }}
                  onChange={(e) => setEndDate(e.target.value)}
                  defaultValue={endDate}
                  focusBorderColor="#34D399"
                  borderColor="#34D399"
                  borderWidth="2px"
                  _placeholder={{
                    color: "#D3212D",
                  }}
                  letterSpacing={"tighter"}
                  fontWeight={"semibold"}
                  _hover={""}
                />
              </Flex>
            </Flex>
          </Flex>
          {roleId == 1 ? (
            <>
              <Flex
                w={"full"}
                position={"relative"}
                justifyContent={"flex-end"}
                mb={8}
              >
                <Select
                  w={{ md: "25%", lg: "23%", xl: "13%" }}
                  borderColor={"#34D399"}
                  borderWidth={"2px"}
                  bgColor={"inherit"}
                  onChange={(e) => setWarehouse(e.target.value)}
                >
                  <option style={{ backgroundColor: "#303032" }} value={0}>
                    All Warehouse
                  </option>
                  {printWarehouseOption()}
                </Select>
              </Flex>
            </>
          ) : null}
          {warehouse == 0 ? (
            <Flex
              p={5}
              mx={"auto"}
              w={{ md: "680px", lg: "680px", xl: "980px" }}
              boxShadow={"dark-lg"}
              border={"2px"}
              borderColor={"#34D399"}
              rounded={"lg"}
              justifyContent={"center"}
              mb={8}
            >
              <Text fontWeight={"semibold"} fontSize={"2xl"}>
                Select a warehouse to view the summary
              </Text>
            </Flex>
          ) : (
            <Flex
              p={5}
              mx={"auto"}
              w={"fit-content"}
              boxShadow={"dark-lg"}
              border={"1px"}
              borderColor={"#34D399"}
              rounded={"lg"}
              mb={8}
            >
              <HStack divider={<StackDivider borderColor="gray.200" />}>
                <Box maxWidth={"40%"}>
                  <Text
                    fontSize={{ lg: "lg", xl: "2xl" }}
                    fontWeight={"bold"}
                    letterSpacing={"wider"}
                    mb={1}
                  >
                    Summary of Changes for All Products
                  </Text>
                  <Text
                    color={"#34D399"}
                    opacity={"0.9"}
                    letterSpacing={"wider"}
                    fontWeight={"semibold"}
                    fontSize={{ lg: "sm", xl: "md" }}
                  >
                    Last 7 Days
                  </Text>
                </Box>
                <Box
                  display={"flex"}
                  ml={3}
                  justifyContent={"space-between"}
                  width={"60%"}
                >
                  <Flex flexDir={"column"} alignItems={"center"}>
                    <Text
                      fontSize={{ md: "md", lg: "md", xl: "lg" }}
                      fontWeight={"semibold"}
                      color={"gray.200"}
                      textAlign={"center"}
                    >
                      ADDITIONS
                    </Text>
                    <Text
                      fontSize={{ md: "lg", lg: "2xl", xl: "3xl" }}
                      fontWeight={"bold"}
                      letterSpacing={"wider"}
                    >
                      {addition}
                    </Text>
                  </Flex>
                  <Flex flexDir={"column"} alignItems={"center"}>
                    <Text
                      fontSize={{ md: "md", lg: "md", xl: "lg" }}
                      fontWeight={"semibold"}
                      color={"gray.200"}
                      textAlign={"center"}
                    >
                      SUBTRACTIONS
                    </Text>
                    <Text
                      fontSize={{ md: "lg", lg: "2xl", xl: "3xl" }}
                      fontWeight={"bold"}
                      letterSpacing={"wider"}
                    >
                      {subtraction}
                    </Text>
                  </Flex>
                  <Flex flexDir={"column"} alignItems={"center"}>
                    <Text
                      fontSize={{ md: "md", lg: "md", xl: "lg" }}
                      fontWeight={"semibold"}
                      color={"gray.200"}
                      textAlign={"center"}
                    >
                      FINAL STOCK
                    </Text>
                    <Text
                      fontSize={{ md: "lg", lg: "2xl", xl: "3xl" }}
                      fontWeight={"bold"}
                      letterSpacing={"wider"}
                    >
                      {finalStock || "-"}
                    </Text>
                  </Flex>
                </Box>
              </HStack>
            </Flex>
          )}
          <Flex
            w={"full"}
            position={"relative"}
            justifyContent={"flex-end"}
            mb={8}
            gap={4}
          >
            <Select
              w={{ md: "21%", lg: "21%", xl: "12%" }}
              borderColor={"#34D399"}
              bgColor={"inherit"}
              onChange={(e) => setProduct(e.target.value)}
              borderWidth={"2px"}
            >
              <option style={{ backgroundColor: "#303032" }} value={0}>
                All Product
              </option>
              {printAllProduct()}
            </Select>
            <Select
              w={{ md: "16%", lg: "16%", xl: "7%" }}
              borderColor={"#34D399"}
              bgColor={"inherit"}
              onChange={(e) => ordering(e.target.value)}
              borderWidth={"2px"}
            >
              <option value={"DESC"} style={{ backgroundColor: "#303032" }}>
                DESC
              </option>
              <option value={"ASC"} style={{ backgroundColor: "#303032" }}>
                ASC
              </option>
            </Select>
          </Flex>
          <TableContainer
            maxH={{ md: "450px", lg: "375px", xl: "450px" }}
            overflowY={"scroll"}
          >
            <Table>
              <Thead>
                <Tr>
                  <Th textAlign={"center"} textColor={"gray.100"}>
                    No
                  </Th>
                  <Th textAlign={"center"} textColor={"gray.100"}>
                    Order No.
                  </Th>
                  <Th textAlign={"center"} textColor={"gray.100"}>
                    Product
                  </Th>
                  <Th textAlign={"center"} textColor={"gray.100"}>
                    Initial Qty
                  </Th>
                  <Th textAlign={"center"} textColor={"gray.100"}>
                    Addition
                  </Th>
                  <Th textAlign={"center"} textColor={"gray.100"}>
                    Subtraction
                  </Th>
                  <Th textAlign={"center"} textColor={"gray.100"}>
                    Supplier
                  </Th>
                  <Th textAlign={"center"} textColor={"gray.100"}>
                    Date
                  </Th>
                </Tr>
              </Thead>

              {stockList.length == 0 ? (
                <Tbody overflowY="scroll">
                  <Text as={"h1"} fontWeight={"semibold"} fontSize={"3xl"}>
                    No Orders Found
                  </Text>
                </Tbody>
              ) : (
                <Tbody overflowY="scroll">
                  {stockList.length == 0 ? <Box>No Data</Box> : printTable()}
                </Tbody>
              )}
            </Table>
          </TableContainer>
          <Flex justifyContent={"flex-end"} mt={6} h={"30px"}>
            {stockList.length != 0 ? (
              <Pagination
                paginate={paginate}
                size={size}
                totalData={totalData}
                page={page}
              />
            ) : null}
          </Flex>
        </Box>
      )}
    </>
  );
}

export default StockReport;
