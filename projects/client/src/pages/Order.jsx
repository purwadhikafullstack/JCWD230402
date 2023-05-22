import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  StackDivider,
  ModalFooter,
  TabPanel,
  Select,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import emptyImg from "../img/empty.png";
import React from "react";
import axios from "axios";
import { API_URL, API_IMG_URL } from "../helper";
import { useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

function Order() {
  const toast = useToast();
  let token = localStorage.getItem("gadgetwarehouse_adminlogin");
  const roleId = useSelector((state) => state.adminReducer.roleId);
  const warehouseId = useSelector((state) => state.adminReducer.warehouseId);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  let defautlPage = parseInt(params.get("page")) - 1 || 0;

  const [status, setStatus] = React.useState(0);
  const [orderList, setOrderList] = React.useState([]);
  const [orderdetails, setOrderDetails] = React.useState(null);
  const [warehouseList, setWarehouseList] = React.useState([]);
  const [warehouseListId, setWarehouseListId] = React.useState(0);

  const [orderBy, setOrderBy] = React.useState("DESC");
  const [page, setPage] = React.useState(defautlPage);
  const [size] = React.useState(8);
  const [totalData, setTotalData] = React.useState(0);

  const modalDetails = useDisclosure();

  function shorten(params) {
    return params.toUpperCase().split("-")[params.split("-").length - 1];
  }

  function formating(params) {
    let total = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(params);

    return total;
  }

  function dateFormat(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      date
    );
    const day = date.getDate();
    const time = new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(date);
    return `${day} ${month} ${year}, ${time} WIB`;
  }

  const getOrder = async () => {
    try {
      if (roleId === 1) {
        if (warehouseListId == 0) {
          if (status === 0) {
            let res = await axios.get(
              `${API_URL}/order/all-order?order=${orderBy}&page=${page}&size=${size}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setOrderList(res.data.data);
            setTotalData(res.data.datanum);
          } else {
            let res = await axios.get(
              `${API_URL}/order/all-order?status=${status}&order=${orderBy}&page=${page}&size=${size}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(`getOrder`, res.data.data);
            setOrderList(res.data.data);
            setTotalData(res.data.datanum);
          }
        } else {
          if (status === 0) {
            let res = await axios.get(
              `${API_URL}/order?order=${orderBy}&page=${page}&size=${size}&warehouseId=${warehouseListId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(`getOrder`, res.data.data);
            setOrderList(res.data.data);
            setTotalData(res.data.datanum);
          } else {
            let res = await axios.get(
              `${API_URL}/order?status=${status}&order=${orderBy}&page=${page}&size=${size}&warehouseId=${warehouseListId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(`getOrder`, res.data.data);
            setOrderList(res.data.data);
            setTotalData(res.data.datanum);
          }
        }
      } else {
        if (status === 0) {
          let res = await axios.get(
            `${API_URL}/order?order=${orderBy}&page=${page}&size=${size}&warehouseId=${warehouseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(`getOrder`, res.data.data);
          setOrderList(res.data.data);
          setTotalData(res.data.datanum);
        } else {
          let res = await axios.get(
            `${API_URL}/order?status=${status}&order=${orderBy}&page=${page}&size=${size}&warehouseId=${warehouseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(`getOrder`, res.data.data);
          setOrderList(res.data.data);
          setTotalData(res.data.datanum);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getOrder();
  }, [status, orderBy]);

  console.log(`orderList`, orderList);
  const printOrder = () => {
    if (orderList.length === 0) {
      return (
        <Flex
          color={"white"}
          maxW={"full"}
          mx={"auto"}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={7}
        >
          <Text as={"h1"} fontWeight={"semibold"} fontSize={"3xl"}>
            No Orders Found
          </Text>
        </Flex>
      );
    } else {
      return orderList.map((val, idx) => {
        return (
          <Card
            mb={"6"}
            size="sm"
            bgColor={"#303032"}
            color={"white"}
            boxShadow={"lg"}
          >
            <CardHeader borderTopRadius={"lg"}>
              <Flex justifyContent={"space-between"} alignContent={"center"}>
                <Text>
                  {val.customer.name} |{}
                  <Text as="span" color={"#1EDB8A"}>
                    {` No. ${shorten(val.uuid)}`}
                  </Text>
                </Text>
                <Text>
                  {dateFormat(val.createdAt).split(",")[0]} |{" "}
                  <Text
                    as={"span"}
                    fontWeight={"semibold"}
                    color={
                      val.status.status === 13
                        ? "#34D399"
                        : val.status.status === 14
                        ? "red.500"
                        : "yellow.500"
                    }
                  >
                    {val.status.status}
                  </Text>
                </Text>
              </Flex>
            </CardHeader>
            <Divider />
            <CardBody>
              <Flex justifyContent={"space-around"} alignItems="center">
                <Image
                  objectFit={"contain"}
                  height={{
                    base: "150px",
                    md: "100px",
                  }}
                  rounded={"xl"}
                  alt="product picture"
                  src={`${API_IMG_URL}${val.orderdetails[0].type.product.productImage}`}
                />

                <Box>
                  <Text>{val.orderdetails[0].type.product.name}</Text>
                  <Text>
                    {val.orderdetails[0].type.color.color} |{" "}
                    {val.orderdetails[0].type.memory.memory}
                  </Text>
                  <Text>{val.orderdetails[0].totalQty} Pcs</Text>

                  {val.orderdetails.length > 1 ? (
                    <Text
                      display={{ base: "none", md: "block" }}
                      textAlign={"left"}
                      color={"gray.400"}
                      fontSize={{ md: "md" }}
                    >
                      +{val.orderdetails.length - 1} other products
                    </Text>
                  ) : null}
                </Box>
                <Box>
                  <Text>Total Price</Text>
                  <Text>{formating(val.finalPrice)}</Text>
                </Box>
              </Flex>
            </CardBody>
            <Divider />
            <CardFooter justifyContent={"space-between"}>
              <Text
                as="u"
                textAlign={"left"}
                fontSize={{ base: "sm", md: "md" }}
                color={"#1BFD9C"}
                cursor={"pointer"}
                onClick={() => {
                  getOrderDetails(val.uuid);
                }}
              >
                View Details
              </Text>
              <ButtonGroup>{printButtons(val.statusId, val.uuid)}</ButtonGroup>
            </CardFooter>
          </Card>
        );
      });
    }
  };

  function printButtons(status, uuid) {
    switch (status) {
      case 10:
        return (
          <>
            <Button
              onClick={() => {
                onApprovePayment(uuid);
              }}
              letterSpacing={"normal"}
              size={"sm"}
              variant={"solid"}
              backgroundColor={"#019d5a"}
              color={"black"}
              _hover={{
                scale: "105",
                bgColor: "#34D399",
              }}
            >
              Approve Payment
            </Button>
            <Button
              onClick={() => {
                onRejectPayment(uuid);
              }}
              letterSpacing={"normal"}
              size={"sm"}
              variant={"solid"}
              backgroundColor={"red.600"}
              color={"black"}
              _hover={{
                scale: "105",
                bgColor: "red.500",
              }}
            >
              Decline Payment
            </Button>
          </>
        );
      case 11:
        return (
          <Button
            onClick={() => {
              onSendProduct(uuid);
            }}
            letterSpacing={"normal"}
            size={"sm"}
            variant={"solid"}
            backgroundColor={"#019d5a"}
            color={"black"}
            _hover={{
              scale: "105",
              bgColor: "#34D399",
            }}
          >
            Send Product
          </Button>
        );

      default:
        break;
    }
  }

  const getOrderDetails = async (uuid) => {
    try {
      modalDetails.onOpen();
      let res = await axios.get(`${API_URL}/order/order-details/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`getOrderDetails`, res.data.data);
      setOrderDetails(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const printProductDetails = () => {
    return orderdetails?.orderdetails.map((val, idx) => {
      return (
        <>
          <Box
            w={"full"}
            boxShadow={"dark-lg"}
            mb={"4"}
            rounded={"lg"}
            mx="auto"
          >
            {/*===================================================================== TOP section ===========================================================================*/}
            <Flex w={"full"} flexDirection={"column"} px="3" pt="3">
              {/*===================================================================== MIddle section ===========================================================================*/}
              <Flex
                w="full"
                borderBottom={"1px"}
                borderBottomColor={"gray.500"}
                mb="4"
              >
                <Flex
                  h={"full"}
                  w={{ base: "50%", md: "35%" }}
                  justifyContent={"center"}
                  mb="1"
                >
                  <Image
                    objectFit={"contain"}
                    height={{
                      base: "150px",
                      md: "200px",
                    }}
                    w={"full"}
                    rounded={"xl"}
                    alt="product picture"
                    src={`${API_IMG_URL}${val.type.product.productImage}`}
                  />
                </Flex>
                <Flex
                  w={{ base: "50%", md: "40%" }}
                  color={"black"}
                  wrap={"wrap"}
                  p={2}
                  alignItems={"center"}
                >
                  <Text
                    as="h1"
                    textAlign={{ base: "left", md: "center" }}
                    fontSize={{ base: "md", md: "xl" }}
                    letterSpacing={"wider"}
                    fontWeight={"hairline"}
                  >
                    {val.type.product.name}
                  </Text>
                  <Text
                    as="p"
                    w={"full"}
                    textAlign={{ base: "left", md: "center" }}
                    my={{ base: "2", md: "2.5", lg: "1" }}
                    letterSpacing={"wider"}
                    fontSize={{ base: "xs", md: "sm", lg: "md" }}
                    display="flex"
                    alignItems="center"
                  >
                    <span
                      style={{
                        borderRight: "1px solid #01a35e",
                        paddingRight: "0.5rem",
                        marginRight: "0.5rem",
                      }}
                    >
                      {val.type.color.color}
                    </span>
                    {val.type.memory.memory} GB
                  </Text>
                  <Text
                    w={"full"}
                    textAlign={{ base: "left", md: "left" }}
                    fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                    color={"gray.600"}
                    letterSpacing={"wider"}
                    fontWeight={"hairline"}
                  >
                    {val.totalQty} Pcs
                  </Text>
                  <Text
                    as="p"
                    w={"full"}
                    textAlign={{ base: "left" }}
                    fontSize={{ base: "sm", md: "lg", lg: "xl" }}
                    letterSpacing={"wider"}
                  >
                    {formating(val.priceOnDate)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex px={3} pb={4} alignItems={"center"} justifyContent={"center"}>
              <Flex
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  as={"span"}
                  textAlign={"center"}
                  color={"black"}
                  letterSpacing={"wider"}
                  fontSize={{ base: "xs", md: "md", lg: "xl" }}
                  fontWeight={"semibold"}
                >
                  Total Price
                </Text>
                <Text
                  as={"span"}
                  textAlign={"center"}
                  color={"black"}
                  letterSpacing={"wider"}
                  fontSize={{ base: "xs", md: "md", lg: "xl" }}
                  fontWeight={"semibold"}
                >
                  {formating(val.priceOnDate * val.totalQty)}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </>
      );
    });
  };

  const handleTabsChange = (index) => {
    setStatus(index);
    setPage(0);
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

  const getWarehouse = async () => {
    try {
      let res = await axios.get(`${API_URL}/warehouse/all-warehouse`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWarehouseList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const printWarehouse = () => {
    return warehouseList.map((val, idx) => {
      return <option value={val.id}>{val.name}</option>;
    });
  };

  const onApprovePayment = async (uuid) => {
    try {
      const res = await axios.patch(
        `${API_URL}/order/payment-confirmation/`,
        {
          uuid: uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getOrder();
      toast({
        title: `${res.data.message}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to approve order`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  const onRejectPayment = async (uuid) => {
    try {
      const res = await axios.patch(
        `${API_URL}/order/payment-rejection/`,
        {
          uuid: uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getOrder();
      toast({
        title: `${res.data.message}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to reject order`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  async function onSendProduct(uuid) {
    try {
      const res = await axios.post(
        `${API_URL}/order/send-product/`,
        {
          uuid: uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getOrder();
      toast({
        title: `${res.data.message}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to send Product`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log("error send product", error);
    }
  }

  React.useEffect(() => {
    getWarehouse();
  }, []);

  React.useEffect(() => {
    getOrder();
  }, [warehouseListId]);

  return (
    <Box mt={{ md: "20px", lg: "20px", xl: "20px" }} textColor="white">
      <Flex justifyContent={"space-between"}>
        <Heading size={{ md: "md", lg: "lg" }} fontStyle="inherit">
          Orders
        </Heading>

        {roleId == 1 ? (
          <Select
            color={"#e8e8e8"}
            w={"3xs"}
            placeholder={"All Warehouse"}
            onChange={(e) => {
              setWarehouseListId(e.target.value);
              getOrder();
            }}
          >
            {printWarehouse()}
          </Select>
        ) : null}
      </Flex>

      <Tabs
        w={{ md: "2xl", lg: "3xl", xl: "5xl" }}
        mx="auto"
        mt={"20px"}
        isLazy
        isFitted
        variant="enclosed"
        onChange={handleTabsChange}
        size={{ md: "sm", lg: "md" }}
      >
        <TabList mb="1em">
          <Tab>All</Tab>
          <Tab>Awaiting Payment</Tab>
          <Tab>Waiting for Confirmation</Tab>
          <Tab>Processing</Tab>
          <Tab>Sent</Tab>
          <Tab>Received</Tab>
          <Tab>Cancelled</Tab>
        </TabList>
        <TabPanels>
          <TabPanel overflowY={"scroll"} height={"69vh"}>
            <Flex mb={"8px"} justifyContent="right">
              <Select
                onChange={(e) => {
                  setOrderBy(e.target.value);
                }}
                w={{ base: "36%", md: "16%", lg: "15%" }}
                float={"right"}
                color={"#e8e8e8"}
              >
                <option style={{ color: "black" }} value="DESC">
                  Newest
                </option>
                <option style={{ color: "black" }} value="ASC">
                  Oldest
                </option>
              </Select>
            </Flex>
            <Box>{printOrder()}</Box>
          </TabPanel>
          <TabPanel>
            <Flex mb={"8px"} justifyContent="right">
              <Select
                onChange={(e) => {
                  setOrderBy(e.target.value);
                }}
                w={{ base: "36%", md: "16%", lg: "13%" }}
                float={"right"}
                color={"#e8e8e8"}
              >
                <option value="DESC">Newest</option>
                <option value="ASC">Oldest</option>
              </Select>
            </Flex>
            <Box>{printOrder()}</Box>
          </TabPanel>
          <TabPanel>
            <Flex mb={"8px"} justifyContent="right">
              <Select
                onChange={(e) => {
                  setOrderBy(e.target.value);
                }}
                w={{ base: "36%", md: "16%", lg: "13%" }}
                float={"right"}
                color={"#e8e8e8"}
              >
                <option value="DESC">Newest</option>
                <option value="ASC">Oldest</option>
              </Select>
            </Flex>
            <Box>{printOrder()}</Box>
          </TabPanel>
          <TabPanel>
            <Flex mb={"8px"} justifyContent="right">
              <Select
                onChange={(e) => {
                  setOrderBy(e.target.value);
                }}
                w={{ base: "36%", md: "16%", lg: "13%" }}
                float={"right"}
                color={"#e8e8e8"}
              >
                <option value="DESC">Newest</option>
                <option value="ASC">Oldest</option>
              </Select>
            </Flex>
            <Box>{printOrder()}</Box>
          </TabPanel>
          <TabPanel>
            <Flex mb={"8px"} justifyContent="right">
              <Select
                onChange={(e) => {
                  setOrderBy(e.target.value);
                }}
                w={{ base: "36%", md: "16%", lg: "13%" }}
                float={"right"}
                color={"#e8e8e8"}
              >
                <option value="DESC">Newest</option>
                <option value="ASC">Oldest</option>
              </Select>
            </Flex>
            <Box>{printOrder()}</Box>
          </TabPanel>
          <TabPanel>
            <Flex mb={"8px"} justifyContent="right">
              <Select
                onChange={(e) => {
                  setOrderBy(e.target.value);
                }}
                w={{ base: "36%", md: "16%", lg: "13%" }}
                float={"right"}
                color={"#e8e8e8"}
              >
                <option value="DESC">Newest</option>
                <option value="ASC">Oldest</option>
              </Select>
            </Flex>
            <Box>{printOrder()}</Box>
          </TabPanel>
          <TabPanel>
            <Flex mb={"8px"} justifyContent="right">
              <Select
                onChange={(e) => {
                  setOrderBy(e.target.value);
                }}
                w={{ base: "36%", md: "16%", lg: "13%" }}
                float={"right"}
                color={"#e8e8e8"}
              >
                <option value="DESC">Newest</option>
                <option value="ASC">Oldest</option>
              </Select>
            </Flex>
            <Box>{printOrder()}</Box>
          </TabPanel>
        </TabPanels>
        <Flex
          justifyContent={"center"}
          display={orderList.length === 0 ? "none" : "flex"}
        >
          <Pagination
            paginate={paginate}
            size={size}
            totalData={totalData}
            page={page}
          />
        </Flex>
      </Tabs>

      <Modal
        onClose={modalDetails.onClose}
        isOpen={modalDetails.isOpen}
        size={{ base: "sm", md: "xl" }}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent bgColor={"white"} textColor={"black"}>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody p={3}>
            <Stack
              spacing={3}
              direction={"column"}
              divider={<StackDivider borderColor="gray.200" border="2px" />}
            >
              <Box>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  fontSize={{ base: "md" }}
                  mb="1"
                >
                  <Text fontWeight={"bold"}>{orderdetails?.status.status}</Text>
                </Flex>
                <Flex
                  justifyContent={"space-between"}
                  fontSize={{ base: "md" }}
                >
                  <Text color={"gray.500"}>Purchase Date</Text>
                  <Text>
                    {orderdetails ? dateFormat(orderdetails?.createdAt) : ""}
                  </Text>
                </Flex>
              </Box>
              <Box px="3">
                <Text fontWeight={"bold"} mb="3">
                  Product Details
                </Text>
                {printProductDetails()}
              </Box>
              <Box>
                <Text fontWeight={"bold"} mb={3}>
                  Payment BreakDown
                </Text>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  fontSize={{ base: "md" }}
                  mb="1"
                >
                  <Text color={"gray.500"}>Payment Method</Text>
                  <Text
                    fontSize={{ base: "sm" }}
                    fontWeight={"semibold"}
                    cursor={"pointer"}
                  >
                    Bank Transfer
                  </Text>
                </Flex>
                <Divider my="2" />
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  fontSize={{ base: "md" }}
                  mb="1"
                >
                  <Text color={"gray.500"}>
                    Subtotal ({orderdetails?.orderdetails.length} Items)
                  </Text>
                  <Text
                    color={"gray.400"}
                    fontSize={{ base: "sm" }}
                    fontWeight={"semibold"}
                  >
                    {formating(
                      orderdetails?.finalPrice / 1.1 - orderdetails?.deliveryFee
                    )}
                  </Text>
                </Flex>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  fontSize={{ base: "md" }}
                  mb="1"
                >
                  <Text color={"gray.500"}>Delivery Cost</Text>
                  <Text
                    color={"gray.400"}
                    fontSize={{ base: "sm" }}
                    fontWeight={"semibold"}
                  >
                    {formating(orderdetails?.deliveryFee)}
                  </Text>
                </Flex>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  fontSize={{ base: "md" }}
                  mb="1"
                >
                  <Text color={"gray.500"}>Tax (10%)</Text>
                  <Text
                    color={"gray.400"}
                    fontSize={{ base: "sm" }}
                    fontWeight={"semibold"}
                  >
                    {formating((orderdetails?.finalPrice / 1.1) * 0.1)}
                  </Text>
                </Flex>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  fontSize={{ base: "md" }}
                  mb="1"
                  fontWeight={"bold"}
                >
                  <Text>Final Price</Text>
                  <Text fontSize={{ base: "sm" }}>
                    {formating(orderdetails?.finalPrice)}
                  </Text>
                </Flex>
              </Box>
              <Box>
                <Text fontWeight={"bold"} mb={3}>
                  Payment Proof
                </Text>
                <Flex justifyContent={"center"}>
                  <Image
                    alt="product picture"
                    src={
                      orderdetails?.paymentProof
                        ? `${API_IMG_URL}${orderdetails?.paymentProof}`
                        : emptyImg
                    }
                    style={{
                      width: "400px",
                      height: "250px",
                      aspectRatio: "1/1",
                      objectFit: "contain",
                    }}
                  />
                </Flex>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Order;
