import React, { useEffect, useState } from "react";

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

function Checkout() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading == true ? (
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
        <Flex
          my={{ base: "24", md: "36" }}
          color={"white"}
          maxW={"100vw"}
          mx={"auto"}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={7}
        >
          Checkout
        </Flex>
      )}
    </>
  );
}

export default Checkout;
