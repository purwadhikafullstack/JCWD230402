import React from "react";
import SearchBar from "../components/SearchBar";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Icon,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { MdOutlineAdd } from "react-icons/md";
import { API_URL } from "../helper";
import axios from "axios";
import Pagination from "../components/Pagination";
import { useSelector } from "react-redux";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

function Category() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const defautlPage = parseInt(params.get("page")) - 1 || 0;
  const defaultSort = params.get("sortby") || "type";
  const defaultOrder = params.get("orderby") || "ASC";
  const defaultFilter = params.get("filter") || "";

  const toast = useToast();
  const roleId = useSelector((state) => state.adminReducer.roleId);

  const modalAdd = useDisclosure();
  const modalEdit = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [page, setPage] = React.useState(defautlPage); // const [size, setSize] = React.useState(5)
  const [size] = React.useState(8);
  const [sortby, setSortby] = React.useState(defaultSort);
  const [order, setOrder] = React.useState(defaultOrder);
  const [filter, setFilter] = React.useState(defaultFilter);
  const [loading, setLoading] = React.useState(true);

  let token = localStorage.getItem("gadgetwarehouse_adminlogin");

  React.useEffect(() => {
    getCategory();
  }, [sortby, order, page]);

  //--------------------------------------- ADD CATEGORY ---------------------------------------------
  const [category, setCategory] = React.useState("");

  const btnSaveCategory = async () => {
    try {
      if (category === "") {
        toast({
          title: `your input is empty`,
          status: "error",
          duration: 2000,
          isClosable: true
        })
      } else {
        let res = await axios.post(
          `${API_URL}/category`,
          {
            name: category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(`res btnSaveCategory`, res);

        if (res.data.success) {
          modalAdd.onClose();
          getCategory();
          toast({
            title: "Category Created.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          setId();
          setCategory("");
        }
      }
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        description: "Please Choose Another Category Name",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  const btnCancelAddCategory = () => {
    modalAdd.onClose();
    getCategory();
    setId();
    setCategory("");
  };

  //--------------------------------------- GET ALL CATEGORY ---------------------------------------------

  const [categoryList, setCategoryList] = React.useState([]);
  const [totalData, setTotalData] = React.useState(1);

  const getCategory = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/category/?page=${page}&size=${size}&sortby=${sortby}&order=${order}&type=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(`res getCategory`, res);
      setLoading(false);
      if (!res.data.data) {
        navigate("*");
      }
      setCategoryList(res.data.data);
      setTotalData(res.data.datanum);
    } catch (error) {
      console.log(error);
    }
  };

  const printCategory = () => {
    console.log(`categorylist`, categoryList);
    return categoryList.map((val, idx) => {
      return (
        <Tr textColor={"white"}>
          <Td>{idx + 1}</Td>
          <Td>{val.type}</Td>
          <Td textColor={val.isDisabled === true ? "red.500" : "green.500"}>
            {val.isDisabled === false ? "Active" : "InActive"}
          </Td>
          {roleId === 1 ? (
            <Td>
              <Button
                _hover={"none"}
                isDisabled={val.isDisabled}
                bgColor={"#1BFD9C"}
                style={{ color: "black" }}
                onClick={() => onBtnEdit(val.type, val.id)}
              >
                Edit
              </Button>

              <Switch
                ml={5}
                colorScheme={"red"}
                size="lg"
                // defaultChecked={val.isDisabled}
                onChange={() => deleteCategory(val.id)}
                isChecked={val.isDisabled}
              />
            </Td>
          ) : null}
        </Tr>
      );
    });
  };

  // ------------------------------ PAGINATION ------------------------------------

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
    // console.log("location on pagination click", location);
  };

  // ------------------------------ DELETE CATEGORY ------------------------------------

  const deleteCategory = async (id) => {
    try {
      let res = await axios.delete(`${API_URL}/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`res deleteCategory`, res);

      if (res.data.success) {
        getCategory();
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ------------------------------ EDIT CATEGORY ------------------------------------

  const [id, setId] = React.useState();
  const onBtnEdit = (type, id) => {
    modalEdit.onOpen();
    setCategory(type);
    setId(id);
  };

  const btnSaveEditCategory = async () => {
    try {
      if (category === "") {
        toast({
          title: `your input is empty`,
          status: "error",
          duration: 2000,
          isClosable: true
        })
      } else {
        let res = await axios.patch(
          `${API_URL}/category/${id}`,
          {
            type: category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(`res btnSaveEditCategory`, res);
        if (res.data.success) {
          modalEdit.onClose();
          getCategory();
          setId();
          setCategory("");
          toast({
            title: `${res.data.message}`,
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
      }

    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        description: "Please Choose Another Category Name",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  const btnCancelEditCategory = () => {
    modalEdit.onClose();
    getCategory();
    setId();
    setCategory("");
  };

  const sorting = (sortbywhat) => {
    if (sortby !== sortbywhat) {
      setSortby(sortbywhat);
      setOrder("ASC");
      params.set("sortby", sortbywhat);
      params.set("orderby", "ASC");
      navigate({ search: params.toString() }); // buat update url
    } else {
      if (order === "DESC") {
        setSortby(sortbywhat); // mau sort by apa
        setOrder("ASC"); // ordernya asc atau DESC
        params.set("sortby", sortbywhat);
        params.set("orderby", "ASC");
        navigate({ search: params.toString() });
      } else {
        setSortby(sortbywhat);
        setOrder("DESC");
        params.set("sortby", sortbywhat);
        params.set("orderby", "DESC");
        navigate({ search: params.toString() });
      }
    }
  };

  const setprops = (setname) => {
    setFilter(setname);
  };

  const onSearchBtn = () => {
    setPage(0);
    params.delete("page");
    getCategory(); // change to get yg lu mau pake
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
      {loading === true ? (
        <Flex
          justifyContent={"center"}
          my={{ base: "24", md: "96" }}
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
        < Box my={"20px"} textColor="white">
          <Flex justifyContent={"space-between"}>
            <Heading size={"lg"} fontStyle="inherit">
              Category List
            </Heading>
            <SearchBar setprops={setprops} onSearchBtn={onSearchBtn} />
            {
              roleId == 1 ? (
                <Button
                  onClick={modalAdd.onOpen}
                  _hover={"none"}
                  bgColor={"#1BFD9C"}
                  style={{ color: "black" }}
                  leftIcon={<MdOutlineAdd />}
                >
                  Add Category
                </Button>
              ) : null
            }
          </Flex>

          {/* ----------------------------------------------MODAL ADD------------------------------------------------ */}
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={modalAdd.isOpen}
            onClose={modalAdd.onClose}
            size={"xl"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Category</ModalHeader>
              {/* <ModalCloseButton /> */}
              <ModalBody pb={6}>
                <FormControl isRequired>
                  <FormLabel>Category Name</FormLabel>
                  <Input
                    type={"text"}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={"Category"}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={btnSaveCategory}>
                  Save
                </Button>
                <Button onClick={btnCancelAddCategory}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* ----------------------------------------------MODAL EDIT------------------------------------------------ */}
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={modalEdit.isOpen}
            onClose={modalEdit.onClose}
            size={"xl"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Category</ModalHeader>
              <ModalBody pb={6}>
                <FormControl isRequired>
                  <FormLabel>Category Name</FormLabel>
                  <Input
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={"User Name"}
                    defaultValue={category}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={btnSaveEditCategory} colorScheme="blue" mr={3}>
                  Save
                </Button>
                <Button onClick={btnCancelEditCategory}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <TableContainer mt={"20px"}>
            <Table>
              <Thead>
                <Tr>
                  <Th textColor={"white"}>No</Th>
                  <Th textColor={"white"}>
                    <Text
                      as="button"
                      onClick={() => {
                        sorting("type");
                      }}
                    >
                      CATEGORY NAME
                      <Icon
                        ml={3}
                        as={
                          sortby === "type" && order === "ASC"
                            ? BsChevronDown
                            : BsChevronUp
                        }
                        display="inline"
                      />
                    </Text>
                  </Th>
                  <Th textColor={"white"}>STATUS</Th>
                  {roleId === 1 ? <Th></Th> : null}
                </Tr>
              </Thead>
              <Tbody>{printCategory()}</Tbody>
            </Table>
          </TableContainer>
          <Flex h={"30px"} mt="30px" justifyContent={"right"}>
            <Pagination
              paginate={paginate}
              size={size}
              totalData={totalData}
              page={page}
            />
          </Flex>
        </Box>
      )}
    </>
  );
}

export default Category;
