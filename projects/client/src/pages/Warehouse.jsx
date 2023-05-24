import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import axios from "axios";
import { MdOutlineAdd, MdPhone, MdSearch } from "react-icons/md";
import { API_URL } from "../helper";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";

function Warehouse() {
  const roleId = useSelector((state) => state.adminReducer.roleId);

  const modalAdd = useDisclosure();
  const modalEdit = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [loading, setLoading] = React.useState(true);

  //-------------------------------PAGINATION AND FILTER -----------------------------------------------------------------------

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const params = new URLSearchParams(location.search);

  const defautlPage = parseInt(params.get("page")) - 1 || 0;
  const defaultSort = params.get("sortby") || "name";
  const defaultOrder = params.get("orderby") || "ASC";
  const defaultFilter = params.get("filter") || "";

  const [page, setPage] = React.useState(defautlPage);
  const [size] = React.useState(8);
  const [sortby, setSortby] = React.useState(defaultSort);
  const [order, setOrder] = React.useState(defaultOrder);
  const [filter, setFilter] = React.useState(defaultFilter);
  const [totalData, setTotalData] = React.useState(0);

  //----------------------GET PROVINCE AND CITY-----------------------------------------------------------------------------------------

  const [province, setProvince] = React.useState([]);
  const [provinceName, setProvinceName] = React.useState("");
  const [provinceId, setProvinceId] = React.useState("");
  const [city, setCity] = React.useState([]);
  const [cityName, setCityName] = React.useState("");
  const [postalCode, setPostalCode] = React.useState();
  // const [province_id, setProvince_id] = React.useState()
  const [city_id, setCity_id] = React.useState("");
  const [uuid, setuuid] = React.useState("");

  let token = localStorage.getItem("gadgetwarehouse_adminlogin");

  const getProvince = async () => {
    try {
      let res = await axios.get(`${API_URL}/rajaongkir/province`);

      setProvince(res.data.rajaongkir.results);
    } catch (error) {
      console.log("error getProvince", error);
    }
  };

  const getCity = async () => {
    try {
      let res = await axios.get(`${API_URL}/rajaongkir/city/${provinceId}`);

      setCity(res.data.rajaongkir.results);
    } catch (error) {
      console.log("error getCity", error);
    }
  };

  React.useEffect(() => {
    getProvince();
    getCity();
    getAllWarehouse();
  }, [provinceId, provinceName]);

  const onClickPrintProvince = (namaprovinsi) => {
    setProvinceName(namaprovinsi);
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

  const onClickPrintCity = (namakota, kodepos) => {
    setCityName(namakota);
    setPostalCode(kodepos);
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

  //--------------------SAVE AND CANCEL WAREHOUSE------------------------
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const btnSaveWarehouse = async () => {
    try {
      if (name == "" || email == "" || phone == "" || address == "") {
        toast({
          title: `your input is empty`,
          status: "error",
          duration: 2000,
          isClosable: true
        })
      } else {
        let res = await axios.post(
          `${API_URL}/warehouse/`,
          {
            name: name,
            email: email,
            address: address,
            province: provinceName,
            city: cityName,
            postalCode: postalCode,
            phone: phone,
            provinceId: provinceId,
            city_id: city_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          toast({
            title: `${res.data.message}`,
            status: "success",
            duration: 2000,
            isClosable: true
          })
          modalAdd.onClose();
          setPostalCode(null);
          setName("");
          setEmail("");
          setPhone("");
          setAddress("");
          getAllWarehouse();
        }

      }

    } catch (error) {
      console.log("ini error addnewarehouse:", error);
      if (error.response.data.error) {
        toast({
          title: `${error.response.data.error[0].msg}`,
          description: "please check your email",
          status: "error",
          duration: 2000,
          isClosable: true
        })
      } else {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true
        })
      }
    }
  };

  const onBtnCancelModalAdd = () => {
    modalAdd.onClose();
    setPostalCode(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  //----------------------------GET ALL WAREHOUSE--------------------------------------------------------

  const [warehouseList, setWarehouseList] = React.useState([]);

  const getAllWarehouse = async () => {
    try {
      let res = await axios.get(`${API_URL}/warehouse/?page=${page}&size=${size}&sortby=${sortby}&order=${order}&name=${filter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalData(res.data.count);
      setWarehouseList(res.data.rows);
      setLoading(false);
      if (!res.data) {
        navigate("*");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const printWarehouse = () => {
    return warehouseList.map((val, idx) => {
      return (
        <Tr textColor={"white"}>
          <Td>{idx + 1}</Td>
          <Td>{val.name}</Td>
          <Td>{val.email}</Td>
          <Td>{val.phone}</Td>
          <Td>
            {val.address}, {val.city}, {val.province}, {val.postalCode}
          </Td>
          <Td textColor={val.isDisabled == true ? "red.500" : "green.500"}>
            {val.isDisabled == false ? "Operating" : "Closed"}
          </Td>
          {roleId == 1 ? (
            <Td>
              <Button
                onClick={() =>
                  onBtnEdit(
                    val.name,
                    val.email,
                    val.phone,
                    val.address,
                    val.city,
                    val.postalCode,
                    val.province,
                    val.province_id,
                    val.city_id,
                    val.uuid
                  )
                }
                _hover={"none"}
                bgColor={"#1BFD9C"}
                style={{ color: "black" }}
              >
                Edit
              </Button>
              <Switch
                ml={5}
                colorScheme={"red"}
                onChange={() => onBtnDelete(val.uuid)}
                size="lg"
                isChecked={val.isDisabled}
              />
            </Td>
          ) : null}
        </Tr>
      );
    });
  };

  //------------------------ EDIT WAREHOUSE ------------------------
  const onBtnEdit = (
    name,
    email,
    phone,
    address,
    city,
    postalCode,
    province,
    provinceId,
    city_id,
    uuid
  ) => {
    modalEdit.onOpen();
    setName(name);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
    setCityName(city);
    setPostalCode(postalCode);
    setProvinceId(provinceId);
    setProvinceName(province);
    setCity_id(city_id);
    setuuid(uuid);
  };

  //---------------------- SAVE EDIT AND CANCEL -------------------------------------------------------

  const btnSaveEditWarehouse = async () => {
    try {
      if (name == "" || email == "" || phone == "" || address == "") {
        toast({
          title: `your input is empty`,
          status: "error",
          duration: 2000,
          isClosable: true
        })
      } else {
        let res = await axios.patch(
          `${API_URL}/warehouse/${uuid}`,
          {
            name: name,
            email: email,
            address: address,
            province: provinceName,
            city: cityName,
            postalCode: postalCode,
            phone: phone,
            provinceId: provinceId,
            city_id: city_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          toast({
            title: `${res.data.message}`,
            status: "success",
            duration: 2000,
            isClosable: true
          })
          modalEdit.onClose();
          setPostalCode(null);
          setName("");
          setEmail("");
          setPhone("");
          setAddress("");
          setuuid("");
          getAllWarehouse();
        }
      }
    } catch (error) {
      console.log("ini error addnewarehouse:", error);
      if (error.response.data.error) {
        toast({
          title: `${error.response.data.error[0].msg}`,
          description: "please check your email",
          status: "error",
          duration: 2000,
          isClosable: true
        })
      } else {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true
        })
      }
    }
  };

  const onBtnCancelModalEdit = () => {
    modalEdit.onClose();
    setPostalCode(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setuuid("");
  };

  //---------------------- DELETE WAREHOUSE --------------------------
  const onBtnDelete = async (uuid) => {
    try {
      let res = await axios.delete(`${API_URL}/warehouse/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAllWarehouse();
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------- SORTING AND PAGINATION ------------------------

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

  React.useEffect(() => {
    getAllWarehouse();
  }, [sortby, order, page]);

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

  //--------------------- SEARCH BAR ---------------------------------------

  const setprops = (setname) => {
    setFilter(setname);
  };

  const onSearchBtn = () => {
    setPage(0);
    params.delete("page");
    getAllWarehouse(); // change to get yg lu mau pake
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
        <Box mt={{ md: "20px", lg: "20px", xl: "20px" }} textColor="white">
          <Flex justifyContent={"space-between"}>
            <Heading size={{ md: "md", lg: "lg" }} fontStyle="inherit">
              Warehouse List
            </Heading>
            <SearchBar setprops={setprops} onSearchBtn={onSearchBtn} />

            {roleId == 1 ? (
              <Button
                onClick={modalAdd.onOpen}
                _hover={"none"}
                bgColor={"#1BFD9C"}
                style={{ color: "black" }}
                leftIcon={<MdOutlineAdd />}
                size={{ md: "sm", lg: "md" }}
              >
                Add Warehouse
              </Button>
            ) : null}
          </Flex>

          {/* ----------------------------------------------MODAL ADD-------------------------------------------------------------------------------------------------- */}
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={modalAdd.isOpen}
            onClose={modalAdd.onClose}
            size={"xl"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Warehouse</ModalHeader>
              <ModalBody pb={6}>
                <Flex>
                  <Box>
                    <FormControl isRequired>
                      <FormLabel>Warehouse Name</FormLabel>
                      <Input
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        ref={initialRef}
                        placeholder="Warehouse Name"
                      />
                    </FormControl>

                    <FormControl mt={2} isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="Email"
                      />
                    </FormControl>

                    <FormControl mt={2} isRequired>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        placeholder="Phone"
                      />
                    </FormControl>

                    <FormControl mt={2} isRequired>
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
                  </Box>

                  <Box pl={4}>
                    <FormControl isRequired>
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

                    <FormControl mt={2} isRequired>
                      <FormLabel>Address</FormLabel>
                      <Textarea
                        onChange={(e) => {
                          setAddress(e.target.value);
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
                      ></Input>
                    </FormControl>
                  </Box>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button onClick={btnSaveWarehouse} colorScheme="blue" mr={3}>
                  Save
                </Button>
                <Button onClick={onBtnCancelModalAdd}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* ----------------------------------------------MODAL EDIT-------------------------------------------------------------------------------------------------- */}
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={modalEdit.isOpen}
            onClose={modalEdit.onClose}
            size={"xl"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Warehouse</ModalHeader>
              <ModalBody pb={6}>
                <Flex>
                  <Box>
                    <FormControl isRequired>
                      <FormLabel>Warehouse Name</FormLabel>
                      <Input
                        defaultValue={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        ref={initialRef}
                        placeholder="Warehouse Name"
                      />
                    </FormControl>

                    <FormControl mt={2} isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        defaultValue={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="Email"
                      />
                    </FormControl>

                    <FormControl mt={2} isRequired>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        defaultValue={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        placeholder="Phone"
                      />
                    </FormControl>

                    <FormControl mt={2} isRequired>
                      <FormLabel>Province</FormLabel>
                      <Select
                        onChange={(e) => {
                          setProvinceId(e.target.value);
                        }}
                        defaultValue={`${provinceId}`}
                      >
                        {printProvince()}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box pl={4}>
                    <FormControl isRequired>
                      <FormLabel>City</FormLabel>
                      <Select
                        onChange={(e) => {
                          setCity_id(e.target.value);
                        }}
                        defaultValue={`${city_id}`}
                      >
                        {printCity()}
                      </Select>
                    </FormControl>

                    <FormControl mt={2} isRequired>
                      <FormLabel>Address</FormLabel>
                      <Textarea
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        placeholder="Address"
                        defaultValue={address}
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
                        defaultValue={postalCode}
                      ></Input>
                    </FormControl>
                  </Box>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button onClick={btnSaveEditWarehouse} colorScheme="blue" mr={3}>
                  Save
                </Button>
                <Button onClick={onBtnCancelModalEdit}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <TableContainer mt={"10px"}>
            <Table>
              <Thead>
                <Tr>
                  <Th textColor={"white"}>No</Th>
                  <Th textColor={"white"}>
                    <Text
                      as="button"
                      onClick={() => {
                        sorting("name");
                      }}
                    >
                      NAME
                      <Icon
                        ml={3}
                        as={
                          sortby === "name" && order === "ASC"
                            ? BsChevronDown
                            : BsChevronUp
                        }
                        display="inline"
                      />
                    </Text>
                  </Th>
                  <Th textColor={"white"}>
                    <Text
                      as="button"
                      onClick={() => {
                        sorting("email");
                      }}
                    >
                      EMAIL
                      <Icon
                        ml={3}
                        as={
                          sortby === "email" && order === "ASC"
                            ? BsChevronDown
                            : BsChevronUp
                        }
                        display="inline"
                      />
                    </Text>
                  </Th>
                  <Th textColor={"white"}>Phone</Th>
                  <Th textColor={"white"}>Address</Th>
                  <Th textColor={"white"}>Status</Th>
                  {roleId == 1 ? <Th></Th> : null}
                </Tr>
              </Thead>
              <Tbody>{printWarehouse()}</Tbody>
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

export default Warehouse;
