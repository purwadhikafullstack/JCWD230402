import React from "react";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";
import axios from "axios";
import { API_URL } from "../helper";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function UserManagement() {
  const toast = useToast();
  const roleId = useSelector((state) => state.adminReducer.roleId);
  const name = useSelector((state) => state.adminReducer.name);

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const defautlPage = parseInt(params.get("page")) - 1 || 0;
  const defaultSort = params.get("sortby") || "name";
  const defaultOrder = params.get("orderby") || "ASC";
  const defaultFilter = params.get("filter") || "";

  const modalAdd = useDisclosure();
  const modalEdit = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [page, setPage] = React.useState(defautlPage);
  const [size] = React.useState(8);
  const [sortby, setSortby] = React.useState(defaultSort);
  const [order, setOrder] = React.useState(defaultOrder);
  const [filter, setFilter] = React.useState(defaultFilter);
  const [totalData, setTotalData] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  let token = localStorage.getItem("gadgetwarehouse_adminlogin");

  const [visible, setVisible] = React.useState("password");
  const klik = () => {
    if (visible === "password") {
      setVisible("text");
    } else {
      setVisible("password");
    }
  };

  React.useEffect(() => {
    getAllAdmin();
    getAllWarehouse();
  }, []);

  //-------------------------- GET ALL ADMIN ----------------------------------
  const [adminList, setAdminList] = React.useState([]);

  const getAllAdmin = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/admin/alladmin/?page=${page}&size=${size}&sortby=${sortby}&order=${order}&name=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(`getAllAdmin`, res.data);
      setTotalData(res.data.datanum);
      setAdminList(res.data.data);
      setLoading(false);
      if (!res.data.data) {
        navigate("*");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const printAllAdmin = () => {
    // console.log(`admin`, adminList);
    return adminList.map((val, idx) => {
      return (
        <Tr textColor={"white"}>
          <Td>{idx + 1}</Td>
          <Td>{val.name}</Td>
          <Td>{val.email}</Td>
          <Td>{val.phone}</Td>
          <Td>
            {val.warehouse == null ? "all warehouse" : val.warehouse.name}
          </Td>
          <Td>{val.roleId === 1 ? "Super Admin" : "Admin"}</Td>
          <Td textColor={val.isDeleted === true ? "red.500" : "green.500"}>
            {val.isDeleted === false ? "Available" : "Unavailable"}
          </Td>
          {roleId === 1 ? (
            // disini nanti tambahin, jika roleId nya sama maka button delete nya hilang
            <Td>
              <Button
                _hover={"none"}
                isDisabled={val.isDeleted}
                bgColor={"#1BFD9C"}
                style={{ color: "black" }}
                onClick={() =>
                  onBtnEdit(
                    val.name,
                    val.email,
                    val.phone,
                    val.password,
                    val.uuid,
                    val.gender,
                    val.warehouseId,
                    val.roleId
                  )
                }
              >
                Edit
              </Button>


              {name === val.name ? null : val.isDeleted === false ? (
                <Switch
                  ml={5}
                  colorScheme={"red"}
                  size="lg"
                  onChange={() => deleteAdmin(val.uuid)}
                />
              ) : (
                <Switch
                  ml={5}
                  colorScheme={"red"}
                  size="lg"
                  defaultChecked
                  onChange={() => deleteAdmin(val.uuid)}
                />
              )}
            </Td>
          ) : null}
        </Tr>
      );
    });
  };

  //------------------------------ ADD ADMIN (SAVE AND CANCEL) ----------------------------------

  const [username, setUsername] = React.useState(" ");
  const [email, setEmail] = React.useState(" ");
  const [password, setPassword] = React.useState(" ");
  const [phone, setPhone] = React.useState(" ");
  const [gender, setGender] = React.useState(" ");
  const [warehouse, setWarehouse] = React.useState();
  const [role, setRole] = React.useState();

  const isErrorUsername = username === "";
  const isErrorEmail = email === "";
  const isErrorPassword = password === "";
  const isErrorPhone = phone === "";

  const btnSaveAddAdmin = async () => {
    try {
      let res = await axios.post(
        `${API_URL}/auth/admin/register`,
        {
          name: username,
          gender: gender,
          phone: phone,
          email: email,
          password: password,
          roleId: role,
          warehouseId: warehouse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`btnSaveAdmin`, res);
      if (res.data.success) {
        modalAdd.onClose();
        getAllAdmin();
        setUsername("");
        setEmail("");
        setPassword("");
        setPhone("");
        setGender("");
        setWarehouse();
        setRole();
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      if (error.response.data.error) {
        toast({
          title: `${error.response.data.error[0].msg}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const btnCancelAddAdmin = () => {
    modalAdd.onClose();
    getAllAdmin();
    setUsername(" ");
    setEmail(" ");
    setPassword(" ");
    setPhone(" ");
    setGender(" ");
    setWarehouse();
    setRole();
    setVisible("password");
  };

  //------------------------------- GET ALL WAREHOUSE -------------------------------------------
  const [warehouseList, setWarehouseList] = React.useState([]);

  const getAllWarehouse = async () => {
    try {
      let res = await axios.get(`${API_URL}/warehouse/allwarehouse`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`getAllWarehouse`, res);
      setWarehouseList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const printAllWarehouse = () => {
    // console.log(`warehouseList`, warehouseList);
    return warehouseList.map((val, idx) => {
      return <option value={val.id}>{val.name}</option>;
    });
  };

  //------------------------------- DELETE ADMIN -------------------------------------------

  const deleteAdmin = async (uuid) => {
    try {
      let res = await axios.delete(`${API_URL}/admin/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(`res deleteAdmin`, res);

      if (res.data.success) {
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        getAllAdmin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //------------------------------- EDIT ADMIN -------------------------------------------

  const [uuid, setUuid] = React.useState("");

  const onBtnEdit = (
    name,
    email,
    phone,
    password,
    uuid,
    gender,
    warehouseId,
    roleId
  ) => {
    modalEdit.onOpen();
    setUsername(name);
    setEmail(email);
    setPhone(phone);
    setPassword(password);
    setUuid(uuid);
    setGender(gender);
    setWarehouse(warehouseId);
    setRole(roleId);
  };

  const btnSaveEditAdmin = async () => {
    try {
      let res = await axios.patch(
        `${API_URL}/admin/${uuid}`,
        {
          name: username,
          email: email,
          phone: phone,
          gender: gender,
          password: password,
          warehouseId: warehouse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`res btnSaveEditAdmin`, res);
      if (res.data.success) {
        toast({
          title: `${res.data.message}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        modalEdit.onClose();
        getAllAdmin();
        setUsername("");
        setEmail("");
        setPassword("");
        setPhone("");
        setGender("");
        setWarehouse();
        setRole();
      }
    } catch (error) {
      if (error.response.data.description) {
        toast({
          title: `${error.response.data.message}`,
          description: `${error.response.data.description}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
      console.log(error);
    }
  };

  const btnCancelEditAddAdmin = () => {
    modalEdit.onClose();
    getAllAdmin();
    setUsername("");
    setEmail("");
    setPassword("");
    setPhone("");
    setGender("");
    setWarehouse();
    setRole();
    setVisible("password");
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

  React.useEffect(() => {
    getAllAdmin();
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
  // ===========================SearchBAR====================================

  const setprops = (setname) => {
    setFilter(setname);
  };

  const onSearchBtn = () => {
    setPage(0);
    params.delete("page");
    getAllAdmin(); // change to get yg lu mau pake
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
        <Box my={"20px"} textColor="white">
          <Flex justifyContent={"space-between"}>
            <Heading size={"lg"} fontStyle="inherit">
              User List
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
                  Add User
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
              <ModalHeader>New User</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Flex>
                  <Box>
                    <FormControl isInvalid={isErrorUsername}>
                      <FormLabel>User Name</FormLabel>
                      <Input
                        type={"text"}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={"User Name"}
                      />
                      {!isErrorUsername ? (
                        <FormHelperText />
                      ) : (
                        <FormErrorMessage>Username is required.</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl mt={2} isInvalid={isErrorEmail}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type={"email"}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={"Email"}
                      />
                      {!isErrorEmail ? (
                        <FormHelperText />
                      ) : (
                        <FormErrorMessage>Email is required.</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl mt={2} isInvalid={isErrorPassword}>
                      <FormLabel>Password</FormLabel>
                      <Flex>
                        <Input
                          onChange={(e) => setPassword(e.target.value)}
                          type={visible}
                          placeholder={"Password"}
                        ></Input>
                        <Button
                          bgColor={"white"}
                          _hover={"none"}
                          fontSize={"xl"}
                          onClick={klik}
                        >
                          {visible === "password" ? <HiEyeOff /> : <HiEye />}
                        </Button>
                      </Flex>

                      {!isErrorPassword ? (
                        <FormHelperText />
                      ) : (
                        <FormErrorMessage>Password is required.</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={isErrorPhone}>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={"Phone"}
                      />
                      {!isErrorPhone ? (
                        <FormHelperText />
                      ) : (
                        <FormErrorMessage>Phone is required.</FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>

                  <Box pl={4}>
                    <FormControl>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onChange={(e) => setGender(e.target.value)}
                        placeholder={"-- Select --"}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Select>
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Role</FormLabel>
                      <Select
                        width={"64"}
                        placeholder={"-- Select --"}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="1">Super Admin</option>
                        <option value="2">Admin</option>
                      </Select>
                    </FormControl>

                    {role === "2" ? (
                      <FormControl mt={2}>
                        <FormLabel>Warehouse</FormLabel>
                        <Select
                          placeholder={"-- Select --"}
                          onChange={(e) => setWarehouse(e.target.value)}
                        >
                          {printAllWarehouse()}
                        </Select>
                      </FormControl>
                    ) : null}

                  </Box>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button onClick={() => btnSaveAddAdmin()} colorScheme="blue" mr={3}>
                  Save
                </Button>
                <Button onClick={btnCancelAddAdmin}>Cancel</Button>
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
              <ModalHeader>Edit User</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Flex>
                  <Box>
                    <FormControl>
                      <FormLabel>User Name</FormLabel>
                      <Input
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={"User Name"}
                        defaultValue={username}
                      />
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={"Email"}
                        defaultValue={email}
                      />
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Password</FormLabel>
                      <Flex>
                        <Input
                          onChange={(e) => setPassword(e.target.value)}
                          type={visible}
                          placeholder={"Password"}
                          defaultValue={password}
                        ></Input>
                        <Button
                          bgColor={"white"}
                          _hover={"none"}
                          fontSize={"xl"}
                          onClick={klik}
                        >
                          {visible === "password" ? <HiEyeOff /> : <HiEye />}
                        </Button>
                      </Flex>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={"Phone"}
                        defaultValue={phone}
                      />
                    </FormControl>
                  </Box>

                  <Box pl={4}>
                    <FormControl>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onChange={(e) => setGender(e.target.value)}
                        placeholder={"-- Select --"}
                        defaultValue={gender}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Select>
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Role</FormLabel>
                      <Select
                        width={"64"}
                        placeholder={"-- Select --"}
                        onChange={(e) => setRole(e.target.value)}
                        defaultValue={role}
                      >
                        <option value="1">Super Admin</option>
                        <option value="2">Admin</option>
                      </Select>
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Warehouse</FormLabel>
                      <Select
                        placeholder={"-- Select --"}
                        onChange={(e) => setWarehouse(e.target.value)}
                        defaultValue={warehouse}
                      >
                        {printAllWarehouse()}
                      </Select>
                    </FormControl>


                  </Box>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button
                  onClick={() => btnSaveEditAdmin()}
                  colorScheme="blue"
                  mr={3}
                >
                  Save
                </Button>
                <Button onClick={btnCancelEditAddAdmin}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* <InputGroup mt={"28px"} w={{ sm: "40", md: "96", lg: "96" }}>
                <InputLeftElement pointerEvents="none" children={<MdSearch size={"22"} color='gray.800' />} />
                <Input type="text" placeholder="Search List" bg="white" color="gray.800" />
            </InputGroup> */}

          <TableContainer mt={"20px"}>
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
                  <Th textColor={"white"}>PHONE</Th>
                  <Th textColor={"white"}>
                    <Text
                      as="button"
                      onClick={() => {
                        sorting("warehouseId");
                      }}
                    >
                      WAREHOUSE
                      <Icon
                        ml={3}
                        as={
                          sortby === "warehouseId" && order === "ASC"
                            ? BsChevronDown
                            : BsChevronUp
                        }
                        display="inline"
                      />
                    </Text>
                  </Th>
                  <Th textColor={"white"}>ROLE</Th>
                  <Th textColor={"white"}>STATUS</Th>
                  {roleId === 1 ? <Th></Th> : null}
                </Tr>
              </Thead>
              <Tbody>{printAllAdmin()}</Tbody>
            </Table>
          </TableContainer>
          {
            <div className="justify-end flex">
              <Pagination paginate={paginate} size={size} totalData={totalData} />
            </div>
          }
        </Box>
      )}
    </>
  );
}

export default UserManagement;
