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
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
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
      // console.log(`ini res getProvince`, res.data.rajaongkir.results);

      setProvince(res.data.rajaongkir.results);
    } catch (error) {
      console.log("error getProvince", error);
    }
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

  React.useEffect(() => {
    getProvince();
    getCity();
    getAllWarehouse();
    // console.log(`provincename`, provinceName);
  }, [provinceId, provinceName]);

  // React.useEffect(() => {
  //     getCity()
  // }, [cityName, postalCode])

  const onClickPrintProvince = (namaprovinsi) => {
    setProvinceName(namaprovinsi);
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

  const onClickPrintCity = (namakota, kodepos) => {
    setCityName(namakota);
    setPostalCode(kodepos);
    console.log(`postalcode`, postalCode);
  };

  const printCity = () => {
    // console.log(`ini dari city`, city);

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

  //--------------------SAVE AND CANCEL WAREHOUSE------------------------
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const btnSaveWarehouse = async () => {
    try {
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
      // console.log(`ini dari resp addnewuser`, res);

      if (res.data.success) {
        alert(res.data.message);
        modalAdd.onClose();
        setPostalCode(null);
        getAllWarehouse();
      }
    } catch (error) {
      console.log("ini error addnewarehouse:", error);
      if (error.response.data.error) {
        alert(error.response.data.error[0].msg);
      } else {
        alert(error.response.data.message);
      }
    }
  };

  const onBtnCancelModalAdd = () => {
    modalAdd.onClose();
    setPostalCode(null);
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
      console.log(`getallwarehouse`, res.data);

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
    // console.log(`ini dari warehouselist`, warehouseList);
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
              <Button
                onClick={() => onBtnDelete(val.uuid)}
                ml={2}
                _hover={"none"}
                bgColor={val.isDisabled == false ? "red.500" : "blue.500"}
                style={{ color: "#E9F8F9" }}
              >
                {val.isDisabled == false ? "Disable" : "Enable"}
              </Button>
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
      // console.log(`ini dari resp addnewuser`, res);

      if (res.data.success) {
        alert(res.data.message);
        modalEdit.onClose();
        setPostalCode(null);
        getAllWarehouse();
        setuuid("");
      }
    } catch (error) {
      console.log("ini error addnewarehouse:", error);
      if (error.response.data.error) {
        alert(error.response.data.error[0].msg);
      } else {
        alert(error.response.data.message);
      }
    }
  };

  const onBtnCancelModalEdit = () => {
    modalEdit.onClose();
    setPostalCode(null);
  };

  //---------------------- DELETE WAREHOUSE --------------------------
  const onBtnDelete = async (uuid) => {
    try {
      let res = await axios.delete(`${API_URL}/warehouse/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
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
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Flex>
                  <Box>
                    <FormControl>
                      <FormLabel>Warehouse Name</FormLabel>
                      <Input
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        ref={initialRef}
                        placeholder="Warehouse Name"
                      />
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="Email"
                      />
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        placeholder="Phone"
                      />
                    </FormControl>

                    <FormControl mt={2}>
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
                  </Box>

                  <Box pl={4}>
                    <FormControl>
                      <FormLabel>City</FormLabel>
                      <Select
                        onChange={(e) => {
                          // setCityName(e.target.value.split(",")[0]);
                          // setPostalCode(e.target.value.split(",")[1]);
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
              <ModalCloseButton
                onClick={() => {
                  setPostalCode(null);
                }}
              />
              <ModalBody pb={6}>
                <Flex>
                  <Box>
                    <FormControl>
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

                    <FormControl mt={2}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        defaultValue={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder="Email"
                      />
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        defaultValue={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        placeholder="Phone"
                      />
                    </FormControl>

                    <FormControl mt={2}>
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
                    <FormControl>
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

                    <FormControl mt={2}>
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

          {/* <InputGroup mt={"28px"} w={{ sm: "40", md: "96", lg: "96" }}>
                <InputLeftElement pointerEvents="none" children={<MdSearch size={"22"} color='gray.800' />} />
                <Input type="text" placeholder="Search List" bg="white" color="gray.800" />
            </InputGroup> */}

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
          {
            <div className="justify-end flex ">
              <Pagination paginate={paginate} size={size} totalData={totalData} />
            </div>
          }
        </Box>
      )}
    </>
  );
}

export default Warehouse;
