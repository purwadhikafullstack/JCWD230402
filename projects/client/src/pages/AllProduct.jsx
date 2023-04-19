import React, { useEffect } from "react";
import {
  Text,
  Flex,
  ButtonGroup,
  IconButton,
  Select,
  Stack,
  InputGroup,
  Input,
  InputRightAddon,
  Icon,
} from "@chakra-ui/react";

import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../helper";
import axios from "axios";

import { BsSortDownAlt } from "react-icons/bs";
import { BsSortUpAlt } from "react-icons/bs";

import { FiSearch } from "react-icons/fi";

function AllProduct() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  let defautlPage = parseInt(params.get("page")) - 1 || 0;
  let defaultSort = params.get("sortby") || "name";

  if (defaultSort === "price") {
    defaultSort = "discountedPrice";
  }

  const defaultOrder = params.get("orderby") || "ASC";
  const defaultFilter = params.get("filter") || "";

  const [page, setPage] = React.useState(defautlPage);
  const [size] = React.useState(8); // to change how many items per page
  const [sortby, setSortby] = React.useState(defaultSort);
  const [order, setOrder] = React.useState(defaultOrder);
  const [filter, setFilter] = React.useState(defaultFilter);
  const [totalData, setTotalData] = React.useState(0);
  const [productList, setProductList] = React.useState([]);

  const getAllProducts = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/product/customerproduct/?page=${page}&size=${size}&sortby=${sortby}&order=${order}&name=${filter}`,
        {}
      );

      console.log(`response getallprodcut =`, res);

      setProductList(res.data.data);
      setTotalData(res.data.datanum);
    } catch (error) {
      console.log("error getAllProduct", error);
    }
  };

  const printProducts = () => {
    return productList.map((val) => {
      return (
        <ProductCard
          name={val.name}
          uuid={val.uuid}
          productimage={val.productImage}
          category={val.category.type}
        />
      );
    });
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

  const sorting = (sortbywhat) => {
    setSortby(sortbywhat);

    if (sortbywhat === "discountedPrice") {
      params.set("sortby", "price");
    } else {
      params.set("sortby", sortbywhat);
    }

    navigate({ search: params.toString() }); // buat update url
  };

  function ordering() {
    if (order === "ASC") {
      setOrder("DESC");
      params.set("orderby", "DESC");
      navigate({ search: params.toString() });
    } else {
      setOrder("ASC");
      params.set("orderby", "ASC");
      navigate({ search: params.toString() });
    }
  }

  useEffect(() => {
    console.log("current filtering", filter);
    console.log("filtering length", filter.length);
  }, [filter]);

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    getAllProducts();
    console.log("page number: ", page);
  }, [sortby, order, page]);

  const onSearchBtn = () => {
    setPage(0);
    params.delete("page");
    getAllProducts(); // change to get yg lu mau pake
    if (filter.length === 0) {
      params.delete("filter");
      navigate({ search: params.toString() });
    } else {
      params.set("filter", filter);
      navigate({ search: params.toString() });
    }
  };

  return (
    <>
      <Flex
        justifyContent={"center"}
        mt={{ base: 24, md: "36" }}
        color={"white"}
        maxW={"100vw"}
      >
        <Text
          as={"h1"}
          fontSize={{ md: "xl", base: "lg" }}
          letterSpacing={"widest"}
          mb={{ base: "5", md: "8" }}
        >
          ALL PRODUCTS
        </Text>
      </Flex>
      <Flex
        color={"white"}
        justifyContent={"end"}
        maxW={"100vw"}
        mr={{ base: "3", md: "0" }}
        mb={{ base: "5", md: "8" }}
      >
        <Flex justifyContent={"space-between"} gap={5}>
          {/* ====================================================================== */}
          <Stack spacing={4}>
            <InputGroup>
              <Input
                type="search"
                variant="filled"
                placeholder="Search..."
                bgColor="#18181B"
                onChange={(e) => setFilter(e.target.value)}
                color="white"
                focusBorderColor="green.500"
              />
              <InputRightAddon
                pointerEvents="visible"
                as="button"
                onClick={() => {
                  onSearchBtn();
                }}
                border="none"
                bgColor="#18181B"
                _active={{ bg: "black", color: "white" }}
              >
                <Icon as={FiSearch} />
              </InputRightAddon>
            </InputGroup>
          </Stack>
          {/* =========================================================================================== */}
          <IconButton
            onClick={ordering}
            icon={
              order === "ASC" ? (
                <BsSortDownAlt color="white" fontSize={"25px"} />
              ) : (
                <BsSortUpAlt color="white" fontSize={"25px"} />
              )
            }
            backgroundColor={"transparent"}
            _hover={{ backgroundColor: "inherit" }}
            color={"#34D399"}
            border={"1px"}
            px={3}
            pb={1}
          ></IconButton>
          <Select
            // options={[{ colorScheme: "black" }]}
            w={"120px"}
            backgroundColor={"transparent"}
            borderColor={"#34D399"}
            defaultValue={sortby}
            onChange={(e) => {
              sorting(e.target.value);
            }}
          >
            <option
              className="option"
              value="name"
              style={{ backgroundColor: "black", margin: 0 }}
            >
              Name
            </option>
            <option
              style={{ backgroundColor: "black", margin: 0 }}
              value="discountedPrice"
            >
              Price
            </option>
            <option
              style={{ backgroundColor: "black", margin: 0 }}
              value="createdAt"
            >
              Newest
            </option>
          </Select>
        </Flex>
        {/*==================================================== sorting drawer ================================================================*/}
      </Flex>
      {/* ====================================================PRODUCT CARD SECTION============================================== */}
      <Flex
        maxW={"100vw"}
        justifyContent={"center"}
        rowGap={"9"}
        columnGap={{ base: "4", md: "7" }}
        flexWrap={"wrap"}
      >
        {printProducts()}
      </Flex>
      <Flex
        justifyContent={"center"}
        color={"white"}
        maxW={"100vw"}
        mt={{ base: "12", md: "16" }}
      >
        <Pagination
          paginate={paginate}
          size={size}
          totalData={totalData}
          page={page}
        />
      </Flex>
    </>
  );
}

export default AllProduct;
